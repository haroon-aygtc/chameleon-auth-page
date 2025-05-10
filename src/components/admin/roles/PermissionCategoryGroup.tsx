
import React from 'react';
import { Permission } from '@/services/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface PermissionCategoryGroupProps {
  moduleName: string;
  category: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
  onCategoryToggle: (permissions: Permission[]) => void;
  isAllView?: boolean;
}

const PermissionCategoryGroup = ({
  moduleName,
  category,
  permissions,
  selectedPermissions,
  onPermissionToggle,
  onCategoryToggle,
  isAllView = false,
}: PermissionCategoryGroupProps) => {
  const idPrefix = isAllView ? 'all-' : '';
  const allSelected = permissions.every(p => selectedPermissions.includes(p.id));
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`${idPrefix}category-${moduleName}-${category}`}
            checked={allSelected}
            onCheckedChange={() => onCategoryToggle(permissions)}
            className="h-5 w-5"
          />
          <Label 
            htmlFor={`${idPrefix}category-${moduleName}-${category}`}
            className="text-base font-medium cursor-pointer"
          >
            {category} ({permissions.length})
          </Label>
        </div>
      </div>
      
      <div className="ml-7 space-y-0 divide-y divide-border rounded-md border">
        {permissions.map((permission) => (
          <div 
            key={permission.id} 
            className="flex items-start p-3 hover:bg-muted/30 transition-colors"
          >
            <Checkbox
              id={`${idPrefix}permission-${permission.id}`}
              checked={selectedPermissions.includes(permission.id)}
              onCheckedChange={() => onPermissionToggle(permission.id)}
              className="mt-1 h-4 w-4"
            />
            <div className="ml-3 grid gap-0.5">
              <Label 
                htmlFor={`${idPrefix}permission-${permission.id}`} 
                className="font-medium cursor-pointer text-sm"
              >
                {permission.name}
              </Label>
              <p className="text-xs text-muted-foreground">
                {permission.description}
              </p>
              {permission.isSystem && (
                <Badge variant="outline" className="mt-1 w-fit text-xs">System</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionCategoryGroup;
