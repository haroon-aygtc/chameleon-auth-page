
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckSquare, Square } from 'lucide-react';

interface PermissionSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPermissionsCount: number;
  totalPermissionsCount: number;
  onToggleAll: () => void;
}

const PermissionSearchHeader = ({
  searchQuery,
  onSearchChange,
  selectedPermissionsCount,
  totalPermissionsCount,
  onToggleAll,
}: PermissionSearchHeaderProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search permissions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleAll}
          className="flex items-center space-x-2"
        >
          {selectedPermissionsCount === totalPermissionsCount ? (
            <Square className="h-4 w-4 mr-1" />
          ) : (
            <CheckSquare className="h-4 w-4 mr-1" />
          )}
          <span>
            {selectedPermissionsCount === totalPermissionsCount ? 'Deselect All' : 'Select All'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PermissionSearchHeader;
