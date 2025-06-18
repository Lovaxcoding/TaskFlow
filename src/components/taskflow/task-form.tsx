"use client";

import type { Task, Priority, TaskList as TaskListType } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, PlusCircle, Tag, Wand2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { suggestTags } from '@/ai/flows/suggest-tags';
import { useToast } from '@/hooks/use-toast';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high'] as [Priority, ...Priority[]]),
  tags: z.array(z.string()).optional(),
  listId: z.string().min(1, 'List ID is required'),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormValues, originalTaskId?: string) => void;
  task?: Task; // For editing
  lists: TaskListType[];
  defaultListId?: string;
}

export function TaskForm({
  isOpen,
  onOpenChange,
  onSubmit,
  task,
  lists,
  defaultListId,
}: TaskFormProps) {
  const { toast } = useToast();
  const [currentTags, setCurrentTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [suggestedAITags, setSuggestedAITags] = useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      priority: 'medium',
      tags: [],
      listId: defaultListId || lists[0]?.id || '',
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        priority: task.priority,
        tags: task.tags,
        listId: task.listId,
      });
      setCurrentTags(task.tags);
    } else {
      form.reset({
        title: '',
        description: '',
        dueDate: undefined,
        priority: 'medium',
        tags: [],
        listId: defaultListId || lists[0]?.id || '',
      });
      setCurrentTags([]);
    }
    setSuggestedAITags([]);
  }, [task, isOpen, form, defaultListId, lists]);

  const handleFormSubmit = (data: TaskFormValues) => {
    onSubmit({ ...data, tags: currentTags }, task?.id);
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      setCurrentTags([...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSuggestTags = async () => {
    const description = form.getValues('description') || form.getValues('title');
    if (!description) {
      toast({
        title: "Cannot suggest tags",
        description: "Please provide a title or description for the task.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggestingTags(true);
    try {
      const result = await suggestTags({ description });
      setSuggestedAITags(result.tags.filter(tag => !currentTags.includes(tag)));
    } catch (error) {
      console.error('Error suggesting tags:', error);
      toast({
        title: "AI Tag Suggestion Failed",
        description: "Could not fetch tag suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const handleAddSuggestedTag = (tag: string) => {
    if (!currentTags.includes(tag)) {
      setCurrentTags([...currentTags, tag]);
    }
    setSuggestedAITags(suggestedAITags.filter(sTag => sTag !== tag));
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Finish project proposal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about the task..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {lists.length > 1 && (
               <FormField
                control={form.control}
                name="listId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>List</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select list" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lists.map(list => (
                          <SelectItem key={list.id} value={list.id}>{list.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" variant="outline" size="icon" onClick={handleAddTag} aria-label="Add tag">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="group pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 opacity-50 group-hover:opacity-100 focus:opacity-100 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </FormItem>
            
            <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggestingTags} className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              {isSuggestingTags ? 'Suggesting...' : 'Suggest Tags with AI'}
            </Button>

            {suggestedAITags.length > 0 && (
              <FormItem>
                <FormLabel>Suggested Tags</FormLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedAITags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      onClick={() => handleAddSuggestedTag(tag)}
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAddSuggestedTag(tag);}}
                    >
                      <Tag className="mr-1.5 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </FormItem>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
