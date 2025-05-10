
import React, { useState, useEffect } from 'react';
import { Permission } from '@/services/types';
import permissionService from '@/services/permissionService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { usePermissionGrouping } from '@/hooks/usePermissionGrouping';
import AllModulesTabContent from './AllModulesTabContent';
import ModuleTabContent from './ModuleTabContent';
import PermissionSearchHeader from './PermissionSearchHeader';
import PermissionModalFooter from './PermissionModalFooter';

interface PermissionAssignmentModalProps {
  isOpen: boolean;
  role: {
    id: string;
    name: string;
    permissions: string[];
  } | null;
  onClose: () => void;
  onSave: (roleId: string, permissionIds: string[]) => void;
}

const PermissionAssignmentModal = ({
  isOpen,
  role,
  onClose,
  onSave,
}: PermissionAssignmentModalProps) => {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch all permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAll(),
    enabled: isOpen,
  });
  
  // Initialize selected permissions when role changes
  useEffect(() => {
    if (role && role.permissions) {
      setSelectedPermissions(role.permissions);
    }
  }, [role]);
  
  // Use our custom hook to handle permission grouping and filtering
  const { modules, filteredPermissions } = usePermissionGrouping(
    permissions,
    searchQuery,
    activeTab
  );
  
  // Handle permission toggle
  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(current => 
      current.includes(permissionId)
        ? current.filter(id => id !== permissionId)
        : [...current, permissionId]
    );
  };
  
  // Toggle all permissions in a category
  const toggleCategory = (categoryPermissions: Permission[]) => {
    const permissionIds = categoryPermissions.map(p => p.id);
    const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p.id));
    
    if (allSelected) {
      // Remove all from this category
      setSelectedPermissions(current => 
        current.filter(id => !permissionIds.includes(id))
      );
    } else {
      // Add all from this category
      setSelectedPermissions(current => {
        const newSelection = new Set([...current]);
        permissionIds.forEach(id => newSelection.add(id));
        return Array.from(newSelection);
      });
    }
  };
  
  // Toggle all permissions in a module
  const toggleAllModulePermissions = (modulePermissions: Record<string, Permission[]>) => {
    const allPermissionIds = Object.values(modulePermissions)
      .flat()
      .map(permission => permission.id);
    
    const allSelected = allPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Remove all from this module
      setSelectedPermissions(current => 
        current.filter(id => !allPermissionIds.includes(id))
      );
    } else {
      // Add all from this module
      setSelectedPermissions(current => {
        const newSelection = new Set([...current]);
        allPermissionIds.forEach(id => newSelection.add(id));
        return Array.from(newSelection);
      });
    }
  };
  
  // Toggle all permissions
  const toggleAllPermissions = () => {
    if (selectedPermissions.length === permissions.length) {
      // Deselect all
      setSelectedPermissions([]);
    } else {
      // Select all
      setSelectedPermissions(permissions.map(p => p.id));
    }
  };
  
  // Calculate total permissions count
  const totalPermissionsCount = permissions.length;
  
  // Handle save
  const handleSave = () => {
    if (role) {
      onSave(role.id, selectedPermissions);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Assign Permissions to {role?.name}</DialogTitle>
          <DialogDescription>
            Select the permissions you want to assign to this role. Use the tabs to filter by module.
          </DialogDescription>
        </DialogHeader>
        
        <PermissionSearchHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPermissionsCount={selectedPermissions.length}
          totalPermissionsCount={totalPermissionsCount}
          onToggleAll={toggleAllPermissions}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-2 flex overflow-x-auto pb-px">
            <TabsTrigger value="all" className="flex-shrink-0">
              All Modules
            </TabsTrigger>
            {modules.map(module => (
              <TabsTrigger key={module} value={module} className="flex-shrink-0">
                {module}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* All modules tab content */}
          <TabsContent value="all" className="mt-0">
            <AllModulesTabContent
              modulesData={filteredPermissions}
              selectedPermissions={selectedPermissions}
              onPermissionToggle={handlePermissionToggle}
              onCategoryToggle={toggleCategory}
              onModuleToggle={toggleAllModulePermissions}
              searchQuery={searchQuery}
            />
          </TabsContent>
          
          {/* Individual module tab content */}
          {modules.map(module => (
            <TabsContent key={module} value={module} className="mt-0">
              <ModuleTabContent
                moduleName={module}
                moduleData={filteredPermissions[module]}
                selectedPermissions={selectedPermissions}
                onPermissionToggle={handlePermissionToggle}
                onCategoryToggle={toggleCategory}
                onModuleToggle={toggleAllModulePermissions}
                searchQuery={searchQuery}
              />
            </TabsContent>
          ))}
        </Tabs>
        
        <PermissionModalFooter
          selectedCount={selectedPermissions.length}
          totalCount={totalPermissionsCount}
          isLoading={isLoading}
          onClose={onClose}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PermissionAssignmentModal;
