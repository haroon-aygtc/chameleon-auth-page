
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModulePermissions } from '@/hooks/usePermissionGrouping';
import ModulePermissionsGroup from './ModulePermissionsGroup';

interface AllModulesTabContentProps {
  modulesData: ModulePermissions;
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
  onCategoryToggle: (permissions: any[]) => void;
  onModuleToggle: (moduleData: any) => void;
  searchQuery: string;
}

const AllModulesTabContent = ({
  modulesData,
  selectedPermissions,
  onPermissionToggle,
  onCategoryToggle,
  onModuleToggle,
  searchQuery,
}: AllModulesTabContentProps) => {
  if (Object.keys(modulesData).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchQuery ? "No permissions match your search" : "No permissions available"}
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[50vh] pr-4">
      <div className="space-y-8">
        {Object.entries(modulesData).map(([moduleName, moduleData]) => (
          <ModulePermissionsGroup
            key={moduleName}
            moduleName={moduleName}
            moduleData={moduleData}
            selectedPermissions={selectedPermissions}
            onPermissionToggle={onPermissionToggle}
            onCategoryToggle={onCategoryToggle}
            onModuleToggle={onModuleToggle}
            isAllView={true}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default AllModulesTabContent;
