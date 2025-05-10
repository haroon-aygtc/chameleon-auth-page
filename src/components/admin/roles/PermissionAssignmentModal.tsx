
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CheckSquare, Square, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';

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

type GroupedPermissions = Record<string, Permission[]>;
type ModulePermissions = Record<string, GroupedPermissions>;

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
  
  // Group permissions by module and category
  const modulePermissions: ModulePermissions = permissions.reduce((modules, permission) => {
    const module = permission.module || 'General';
    const category = permission.category;
    
    if (!modules[module]) {
      modules[module] = {};
    }
    
    if (!modules[module][category]) {
      modules[module][category] = [];
    }
    
    modules[module][category].push(permission);
    return modules;
  }, {} as ModulePermissions);
  
  // Get all available modules
  const modules = Object.keys(modulePermissions).sort();
  
  // Filter permissions based on search and active tab
  const getFilteredPermissions = () => {
    const result: ModulePermissions = {};
    
    Object.entries(modulePermissions).forEach(([module, categories]) => {
      // Skip if not in the active module tab
      if (activeTab !== 'all' && activeTab !== module) {
        return;
      }
      
      const filteredModule: GroupedPermissions = {};
      
      Object.entries(categories).forEach(([category, perms]) => {
        const filteredPerms = perms.filter(p => 
          searchQuery === '' || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (filteredPerms.length > 0) {
          filteredModule[category] = filteredPerms;
        }
      });
      
      if (Object.keys(filteredModule).length > 0) {
        result[module] = filteredModule;
      }
    });
    
    return result;
  };
  
  const filteredPermissions = getFilteredPermissions();
  
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
  const toggleAllModulePermissions = (modulePermissions: GroupedPermissions) => {
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
            {renderModulesContent(filteredPermissions)}
          </TabsContent>
          
          {/* Individual module tab content */}
          {modules.map(module => (
            <TabsContent key={module} value={module} className="mt-0">
              {renderModuleContent(module, filteredPermissions[module])}
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
  
  // Helper function to render module content
  function renderModuleContent(moduleName: string, moduleData: GroupedPermissions) {
    if (!moduleData || Object.keys(moduleData).length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "No permissions match your search" : "No permissions available"}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-semibold text-lg">{moduleName}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleAllModulePermissions(moduleData)}
            className="text-xs"
          >
            {Object.values(moduleData).flat().every(p => selectedPermissions.includes(p.id))
              ? 'Deselect All'
              : 'Select All'}
          </Button>
        </div>
        
        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-6">
            {Object.entries(moduleData).map(([category, permissions]) => (
              <div key={`${moduleName}-${category}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${moduleName}-${category}`}
                      checked={permissions.every(p => selectedPermissions.includes(p.id))}
                      onCheckedChange={() => toggleCategory(permissions)}
                      className="h-5 w-5"
                    />
                    <Label 
                      htmlFor={`category-${moduleName}-${category}`}
                      className="text-base font-medium cursor-pointer"
                    >
                      {category} ({permissions.length})
                    </Label>
                  </div>
                </div>
                
                <div className="ml-7 space-y-2 divide-y divide-border rounded-md border">
                  {permissions.map((permission) => (
                    <div 
                      key={permission.id} 
                      className="flex items-start p-3 hover:bg-muted/30 transition-colors"
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                        className="mt-1 h-4 w-4"
                      />
                      <div className="ml-3 grid gap-0.5">
                        <Label 
                          htmlFor={`permission-${permission.id}`} 
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
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }
  
  // Helper function to render all modules content
  function renderModulesContent(modulesData: ModulePermissions) {
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
            <div key={moduleName} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold text-lg">{moduleName}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAllModulePermissions(moduleData)}
                  className="text-xs"
                >
                  {Object.values(moduleData).flat().every(p => selectedPermissions.includes(p.id))
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>
              
              {Object.entries(moduleData).map(([category, permissions]) => (
                <div key={`${moduleName}-${category}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`all-category-${moduleName}-${category}`}
                        checked={permissions.every(p => selectedPermissions.includes(p.id))}
                        onCheckedChange={() => toggleCategory(permissions)}
                        className="h-5 w-5"
                      />
                      <Label 
                        htmlFor={`all-category-${moduleName}-${category}`}
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
                          id={`all-permission-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                          className="mt-1 h-4 w-4"
                        />
                        <div className="ml-3 grid gap-0.5">
                          <Label 
                            htmlFor={`all-permission-${permission.id}`} 
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
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }
};

export default PermissionAssignmentModal;
