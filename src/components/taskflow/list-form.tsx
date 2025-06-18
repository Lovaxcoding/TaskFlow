"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from 'react';
import type { TaskList } from "@/lib/types";

const listFormSchema = z.object({
  name: z.string().min(1, "List name is required").max(50, "List name is too long"),
});

type ListFormValues = z.infer<typeof listFormSchema>;

interface ListFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ListFormValues, originalListId?: string) => void;
  list?: TaskList; // For editing
}

export function ListForm({ isOpen, onOpenChange, onSubmit, list }: ListFormProps) {
  const form = useForm<ListFormValues>({
    resolver: zodResolver(listFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (list) {
      form.reset({ name: list.name });
    } else {
      form.reset({ name: "" });
    }
  }, [list, isOpen, form]);

  const handleFormSubmit = (data: ListFormValues) => {
    onSubmit(data, list?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{list ? "Edit List" : "Create New List"}</DialogTitle>
          <DialogDescription>
            {list ? "Update the name of your task list." : "Enter a name for your new task list."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>List Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Work Projects, Personal Errands" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{list ? "Save Changes" : "Create List"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
