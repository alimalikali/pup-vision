'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  showFilters: boolean;
  onToggleFilters: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function PageHeader({ title, description, onToggleFilters, sortBy, onSortChange }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onToggleFilters}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compatibility">Best Match</SelectItem>
              <SelectItem value="purpose">Purpose Alignment</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
