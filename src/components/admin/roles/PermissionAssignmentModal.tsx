
import React, { useState, useEffect } from 'react';
import { Role, Permission, permissionService } from '@/services/mockDatabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PermissionAssignmentModalProps {
  isOpen: boolean;
  role: Role | null;
  onClose: () => void;
  onSave: (roleId: string, permissionIds: string[]) => void;
}

type GroupedPermissions = Record<string, Permission[]>;

const PermissionAssignmentModal = ({
  isOpen,
  role,
  onClose,
  onSave,
}: PermissionAssignmentModalProps) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Group permissions by category
  const groupedPermissions: GroupedPermissions = permissions.reduce((groups, permission) => {
    const { category } = permission;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {} as GroupedPermissions);
  
  // Filter permissions based on search
  const filteredGroups = Object.entries(groupedPermissions).reduce((filtered, [category, perms]) => {
    const filteredPerms = perms.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredPerms.length > 0) {
      filtered[category] = filteredPerms;
    }
    
    return filtered;
  }, {} as GroupedPermissions);

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      try {
        const allPermissions = await permissionService.getAll();
        setPermissions(allPermissions);
        
        if (role) {
          setSelectedPermissions(role.permissions || []);
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && role) {
      fetchPermissions();
    }
  }, [isOpen, role]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(current => 
      current.includes(permissionId)
        ? current.filter(id => id !== permissionId)
        : [...current, permissionId]
    );
  };
  
  const toggleCategory = (category: string, categoryPermissions: Permission[]) => {
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

  const handleSave = () => {
    if (role) {
      onSave(role.id, selectedPermissions);
    }
  };

  if (!role) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Permissions to {role.name}</DialogTitle>
        </DialogHeader>

        <div className="relative py-2">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading permissions...</p>
            </div>
          ) : (
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-6">
                {Object.keys(filteredGroups).length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    {searchQuery ? "No permissions match your search" : "No permissions available"}
                  </p>
                ) : (
                  Object.entries(filteredGroups).map(([category, categoryPermissions]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`}
                          checked={categoryPermissions.every(p => selectedPermissions.includes(p.id))}
                          onCheckedChange={() => toggleCategory(category, categoryPermissions)}
                          className="h-5 w-5"
                        />
                        <Label 
                          htmlFor={`category-${category}`}
                          className="text-base font-semibold cursor-pointer"
                        >
                          {category} ({categoryPermissions.length})
                        </Label>
                      </div>
                      
                      <div className="ml-7 space-y-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                              className="mt-1"
                            />
                            <div className="grid gap-1">
                              <Label 
                                htmlFor={`permission-${permission.id}`} 
                                className="font-medium cursor-pointer"
                              >
                                {permission.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center mr-auto text-sm text-muted-foreground">
            {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''} selected
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionAssignmentModal;
