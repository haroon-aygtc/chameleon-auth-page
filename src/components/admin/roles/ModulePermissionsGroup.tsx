
import React from 'react';
import { Button } from '@/components/ui/button';
import { Permission } from '@/services/types';
import PermissionCategoryGroup from './PermissionCategoryGroup';

interface ModulePermissionsGroupProps {
  moduleName: string;
  moduleData: Record<string, Permission[]>;
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
  onCategoryToggle: (permissions: Permission[]) => void;
  onModuleToggle: (moduleData: Record<string, Permission[]>) => void;
  isAllView?: boolean;
}

const ModulePermissionsGroup = ({
  moduleName,
  moduleData,
  selectedPermissions,
  onPermissionToggle,
  onCategoryToggle,
  onModuleToggle,
  isAllView = false,
}: ModulePermissionsGroupProps) => {
  const allPermissions = Object.values(moduleData).flat();
  const allSelected = allPermissions.every(p => selectedPermissions.includes(p.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-semibold text-lg">{moduleName}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onModuleToggle(moduleData)}
          className="text-xs"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </Button>
      </div>
      
      {Object.entries(moduleData).map(([category, permissions]) => (
        <PermissionCategoryGroup
          key={`${moduleName}-${category}`}
          moduleName={moduleName}
          category={category}
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          onPermissionToggle={onPermissionToggle}
          onCategoryToggle={onCategoryToggle}
          isAllView={isAllView}
        />
      ))}
    </div>
  );
};

export default ModulePermissionsGroup;
