export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  priority: Priority;
  tags: string[];
  listId: string;
}

export interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
}
