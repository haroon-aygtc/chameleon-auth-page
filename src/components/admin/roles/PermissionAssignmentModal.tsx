
import React, { useState, useEffect } from 'react';
import { Permission } from '@/services/types';
import permissionService from '@/services/permissionService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CheckSquare, Square, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePermissionGrouping } from '@/hooks/usePermissionGrouping';
import AllModulesTabContent from './AllModulesTabContent';
import ModuleTabContent from './ModuleTabContent';

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
        
        <div className="flex items-center justify-between py-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleAllPermissions}
              className="flex items-center space-x-2"
            >
              {selectedPermissions.length === totalPermissionsCount ? (
                <Square className="h-4 w-4 mr-1" />
              ) : (
                <CheckSquare className="h-4 w-4 mr-1" />
              )}
              <span>{selectedPermissions.length === totalPermissionsCount ? 'Deselect All' : 'Select All'}</span>
            </Button>
          </div>
        </div>
        
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
              <ScrollArea className="h-[50vh] pr-4">
                <ModuleTabContent
                  moduleName={module}
                  moduleData={filteredPermissions[module]}
                  selectedPermissions={selectedPermissions}
                  onPermissionToggle={handlePermissionToggle}
                  onCategoryToggle={toggleCategory}
                  onModuleToggle={toggleAllModulePermissions}
                  searchQuery={searchQuery}
                />
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 mr-auto">
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              {selectedPermissions.length} of {totalPermissionsCount} selected
            </Badge>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionAssignmentModal;
