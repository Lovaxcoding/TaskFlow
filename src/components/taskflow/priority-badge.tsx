import type { Priority } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showText?: boolean;
}

export function PriorityBadge({ priority, showText = false }: PriorityBadgeProps) {
  const priorityConfig = {
    low: {
      label: 'Low',
      icon: <ArrowDown className="h-3 w-3" />,
      color: 'bg-blue-500 hover:bg-blue-500', // Using specific colors for better distinction
      textColor: 'text-white',
    },
    medium: {
      label: 'Medium',
      icon: <Minus className="h-3 w-3" />,
      color: 'bg-yellow-500 hover:bg-yellow-500',
      textColor: 'text-white',
    },
    high: {
      label: 'High',
      icon: <ArrowUp className="h-3 w-3" />,
      color: 'bg-red-500 hover:bg-red-500',
      textColor: 'text-white',
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge
      variant="default"
      className={cn(
        'flex items-center gap-1.5 capitalize text-xs px-2 py-1',
        config.color,
        config.textColor
      )}
      aria-label={`Priority: ${config.label}`}
    >
      {config.icon}
      {showText && <span>{config.label}</span>}
    </Badge>
  );
}
