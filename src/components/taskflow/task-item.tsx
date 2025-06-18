"use client";

import type { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from './priority-badge';
import { TaskActions } from './task-actions';
import { CalendarDays, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className={cn("mb-3 shadow-sm hover:shadow-md transition-shadow duration-200", task.completed ? "bg-muted/50" : "bg-card")}>
      <CardHeader className="flex flex-row items-start space-x-3 p-4 pb-2">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          className="mt-1 flex-shrink-0"
        />
        <div className="flex-grow space-y-1">
          <CardTitle
            className={cn(
              "text-base font-medium leading-tight",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </CardTitle>
          {task.dueDate && isClient && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3 mr-1.5" />
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <PriorityBadge priority={task.priority} />
          <TaskActions onEdit={() => onEdit(task)} onDelete={() => onDelete(task.id)} />
        </div>
      </CardHeader>
      
      {(task.description || task.tags.length > 0) && (
        <CardContent className="px-4 pb-3 pt-0">
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-muted-foreground hover:text-foreground -ml-2 mb-1"
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
          {isExpanded && (
            <div className="pl-8 space-y-2 animate-accordion-down">
              {task.description && (
                <p className={cn("text-sm text-muted-foreground", task.completed && "line-through")}>
                  {task.description}
                </p>
              )}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
