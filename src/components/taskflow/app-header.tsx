
import { CheckSquare } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <CheckSquare className="h-8 w-8 mr-3" />
          <h1 className="text-2xl font-headline font-semibold">TaskFlow</h1>
        </div>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
