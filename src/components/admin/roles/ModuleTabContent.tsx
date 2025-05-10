
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GroupedPermissions } from '@/hooks/usePermissionGrouping';
import ModulePermissionsGroup from './ModulePermissionsGroup';

interface ModuleTabContentProps {
  moduleName: string;
  moduleData: GroupedPermissions;
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
  onCategoryToggle: (permissions: any[]) => void;
  onModuleToggle: (moduleData: any) => void;
  searchQuery: string;
}

const ModuleTabContent = ({
  moduleName,
  moduleData,
  selectedPermissions,
  onPermissionToggle,
  onCategoryToggle,
  onModuleToggle,
  searchQuery,
}: ModuleTabContentProps) => {
  if (!moduleData || Object.keys(moduleData).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchQuery ? "No permissions match your search" : "No permissions available"}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <ModulePermissionsGroup
        moduleName={moduleName}
        moduleData={moduleData}
        selectedPermissions={selectedPermissions}
        onPermissionToggle={onPermissionToggle}
        onCategoryToggle={onCategoryToggle}
        onModuleToggle={onModuleToggle}
      />
    </div>
  );
};

export default ModuleTabContent;
