
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2 } from 'lucide-react';

interface PermissionModalFooterProps {
  selectedCount: number;
  totalCount: number;
  isLoading: boolean;
  onClose: () => void;
  onSave: () => void;
}

const PermissionModalFooter = ({
  selectedCount,
  totalCount,
  isLoading,
  onClose,
  onSave,
}: PermissionModalFooterProps) => {
  return (
    <DialogFooter className="gap-2 sm:gap-0">
      <div className="flex items-center space-x-2 mr-auto">
        <Badge variant="secondary" className="px-2 py-1 text-xs">
          {selectedCount} of {totalCount} selected
        </Badge>
      </div>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button onClick={onSave} disabled={isLoading} className="flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </DialogFooter>
  );
};

export default PermissionModalFooter;
