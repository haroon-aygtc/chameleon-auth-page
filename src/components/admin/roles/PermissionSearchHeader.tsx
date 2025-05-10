
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckSquare, Square, Loader2 } from 'lucide-react';

interface PermissionSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPermissionsCount: number;
  totalPermissionsCount: number;
  onToggleAll: () => void;
  isLoading?: boolean;
}

const PermissionSearchHeader = ({
  searchQuery,
  onSearchChange,
  selectedPermissionsCount,
  totalPermissionsCount,
  onToggleAll,
  isLoading = false,
}: PermissionSearchHeaderProps) => {
  return (
    <div className="flex items-center justify-between py-2 gap-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search permissions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleAll}
          className="flex items-center space-x-2 whitespace-nowrap"
          disabled={isLoading || totalPermissionsCount === 0}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : selectedPermissionsCount === totalPermissionsCount ? (
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
