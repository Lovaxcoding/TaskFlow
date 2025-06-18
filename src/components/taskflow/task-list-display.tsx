"use client";

import type { TaskList, Task } from '@/lib/types';
import { TaskItem } from './task-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit2, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';

interface TaskListDisplayProps {
  list: TaskList;
  onAddTask: (listId: string) => void;
  onToggleTaskComplete: (taskId: string, listId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, listId: string) => void;
  onEditList: (list: TaskList) => void;
  onDeleteList: (listId: string) => void;
}

export function TaskListDisplay({
  list,
  onAddTask,
  onToggleTaskComplete,
  onEditTask,
  onDeleteTask,
  onEditList,
  onDeleteList
}: TaskListDisplayProps) {

  const pendingTasks = list.tasks.filter(task => !task.completed);
  const completedTasks = list.tasks.filter(task => task.completed);

  return (
    <Card className="w-full shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-card-foreground/5 p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-headline text-primary">{list.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">List options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditList(list)} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" />
                <span>Edit List Name</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteList(list.id)} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete List</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          {pendingTasks.length} pending task{pendingTasks.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {list.tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-50"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <p className="font-semibold">All Clear!</p>
            <p className="text-sm">This list is empty. Add a new task to get started.</p>
          </div>
        )}

        {pendingTasks.length > 0 && (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={() => onToggleTaskComplete(task.id, list.id)}
                onEdit={onEditTask}
                onDelete={() => onDeleteTask(task.id, list.id)}
              />
            ))}
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Completed ({completedTasks.length})</h3>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={() => onToggleTaskComplete(task.id, list.id)}
                  onEdit={onEditTask}
                  onDelete={() => onDeleteTask(task.id, list.id)}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t bg-card-foreground/5">
        <Button onClick={() => onAddTask(list.id)} className="w-full" variant="default">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Task to "{list.name}"
        </Button>
      </CardFooter>
    </Card>
  );
}
