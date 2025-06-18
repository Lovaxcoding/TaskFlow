"use client";

import React, { useState, useEffect } from 'react';
import type { Task, TaskList as TaskListType } from '@/lib/types';
import { AppHeader } from '@/components/taskflow/app-header';
import { TaskForm } from '@/components/taskflow/task-form';
import { ListForm } from '@/components/taskflow/list-form';
import { TaskListDisplay } from '@/components/taskflow/task-list-display';
import { ConfirmDialog } from '@/components/taskflow/confirm-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TaskFlowPage() {
  const [lists, setLists] = useState<TaskListType[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isListFormOpen, setIsListFormOpen] = useState(false);
  const [editingList, setEditingList] = useState<TaskListType | undefined>(undefined);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmDialogContent, setConfirmDialogContent] = useState({ title: '', description: '' });
  const [defaultListIdForNewTask, setDefaultListIdForNewTask] = useState<string | undefined>(undefined);

  const { toast } = useToast();

  useEffect(() => {
    // Load lists from local storage on component mount
    const storedLists = localStorage.getItem('taskflow-lists');
    if (storedLists) {
      const parsedLists = JSON.parse(storedLists).map((list: TaskListType) => ({
        ...list,
        tasks: list.tasks.map(task => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        })),
      }));
      setLists(parsedLists);
    } else {
      // Initialize with a default list if nothing is stored
      setLists([{ id: crypto.randomUUID(), name: 'My Tasks', tasks: [] }]);
    }
  }, []);

  useEffect(() => {
    // Save lists to local storage whenever they change
    if (lists.length > 0 || localStorage.getItem('taskflow-lists')) { // Avoid saving empty initial state if nothing was loaded
        localStorage.setItem('taskflow-lists', JSON.stringify(lists));
    }
  }, [lists]);


  const handleOpenTaskForm = (task?: Task, listId?: string) => {
    setEditingTask(task);
    setDefaultListIdForNewTask(listId);
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSubmit = (data: Omit<Task, 'id' | 'completed'> & { listId: string }, originalTaskId?: string) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id === data.listId) {
          if (originalTaskId) { // Editing existing task
            const taskIndex = list.tasks.findIndex((t) => t.id === originalTaskId);
             if (taskIndex === -1) { // Task moved lists
              const updatedTasks = list.tasks.filter(t => t.id !== originalTaskId); // Remove from old list potentially
              // Add to new list
              const otherListsUpdated = prevLists.map(l => {
                if(l.id === data.listId) return {...l, tasks: [...l.tasks, { ...data, id: originalTaskId, completed: editingTask!.completed }]}
                return {...l, tasks: l.tasks.filter(t => t.id !== originalTaskId)}
              });
              return otherListsUpdated.find(l => l.id === list.id) || list; // This logic needs to be outside this map to update all lists at once
            }

            const updatedTasks = list.tasks.map((t) =>
              t.id === originalTaskId ? { ...t, ...data } : t
            );
            return { ...list, tasks: updatedTasks };
          } else { // Adding new task
            const newTask: Task = {
              ...data,
              id: crypto.randomUUID(),
              completed: false,
            };
            return { ...list, tasks: [...list.tasks, newTask] };
          }
        }
        return list;
      })
    );
     // If task moved lists, this more complex update is needed
    if (originalTaskId && editingTask && editingTask.listId !== data.listId) {
        setLists(prevLists => {
            let taskToMove: Task | undefined;
            // Remove from old list
            const listsWithoutTask = prevLists.map(l => {
                if (l.id === editingTask.listId) {
                    taskToMove = l.tasks.find(t => t.id === originalTaskId);
                    return {...l, tasks: l.tasks.filter(t => t.id !== originalTaskId)};
                }
                return l;
            });
            // Add to new list
            if (taskToMove) {
                return listsWithoutTask.map(l => {
                    if (l.id === data.listId) {
                        return {...l, tasks: [...l.tasks, {...taskToMove!, ...data, listId: data.listId}]};
                    }
                    return l;
                });
            }
            return prevLists; // Should not happen if taskToMove is found
        });
    }

    toast({
      title: `Task ${originalTaskId ? 'Updated' : 'Created'}`,
      description: `Task "${data.title}" has been successfully ${originalTaskId ? 'updated' : 'created'}.`,
    });
    setEditingTask(undefined);
  };

  const handleToggleComplete = (taskId: string, listId: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : list
      )
    );
  };

  const handleDeleteTask = (taskId: string, listId: string) => {
    setConfirmDialogContent({ title: 'Delete Task?', description: 'Are you sure you want to delete this task? This action cannot be undone.' });
    setConfirmAction(() => () => {
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }
            : list
        )
      );
      toast({ title: 'Task Deleted', description: 'The task has been successfully deleted.', variant: 'destructive' });
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleOpenListForm = (list?: TaskListType) => {
    setEditingList(list);
    setIsListFormOpen(true);
  };

  const handleListFormSubmit = (data: { name: string }, originalListId?: string) => {
    if (originalListId) { // Editing list
      setLists(prevLists => prevLists.map(list => list.id === originalListId ? { ...list, name: data.name } : list));
      toast({ title: 'List Updated', description: `List "${data.name}" has been successfully updated.` });
    } else { // Adding new list
      const newList: TaskListType = { id: crypto.randomUUID(), name: data.name, tasks: [] };
      setLists(prevLists => [...prevLists, newList]);
      toast({ title: 'List Created', description: `List "${data.name}" has been successfully created.` });
    }
    setEditingList(undefined);
  };

  const handleDeleteList = (listId: string) => {
    const listToDelete = lists.find(l => l.id === listId);
    if (listToDelete && listToDelete.tasks.length > 0) {
        setConfirmDialogContent({ title: 'Delete List?', description: `"${listToDelete.name}" contains tasks. Are you sure you want to delete this list and all its tasks? This action cannot be undone.` });
    } else {
        setConfirmDialogContent({ title: 'Delete List?', description: `Are you sure you want to delete the list "${listToDelete?.name || 'this list'}"? This action cannot be undone.` });
    }
    
    setConfirmAction(() => () => {
      setLists(prevLists => prevLists.filter(list => list.id !== listId));
      toast({ title: 'List Deleted', description: `The list has been successfully deleted.`, variant: 'destructive' });
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <Button onClick={() => handleOpenListForm()} variant="default">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New List
          </Button>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-card p-8 rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-30"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="16" y2="21"></line><line x1="3" y1="8" x2="21" y2="8"></line><line x1="3" y1="16" x2="21" y2="16"></line></svg>
            <h2 className="text-2xl font-semibold mb-2">No lists yet!</h2>
            <p className="mb-6">Create your first task list to get started organizing your to-dos.</p>
            <Button onClick={() => handleOpenListForm()} size="lg">
              <PlusCircle className="mr-2 h-5 w-5" /> Create Your First List
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <TaskListDisplay
                key={list.id}
                list={list}
                onAddTask={() => handleOpenTaskForm(undefined, list.id)}
                onToggleTaskComplete={handleToggleComplete}
                onEditTask={(task) => handleOpenTaskForm(task)}
                onDeleteTask={handleDeleteTask}
                onEditList={handleOpenListForm}
                onDeleteList={handleDeleteList}
              />
            ))}
          </div>
        )}
      </main>

      <TaskForm
        isOpen={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        onSubmit={handleTaskFormSubmit}
        task={editingTask}
        lists={lists}
        defaultListId={defaultListIdForNewTask}
      />
      <ListForm
        isOpen={isListFormOpen}
        onOpenChange={setIsListFormOpen}
        onSubmit={handleListFormSubmit}
        list={editingList}
      />
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={() => confirmAction && confirmAction()}
        title={confirmDialogContent.title}
        description={confirmDialogContent.description}
      />
    </div>
  );
}
