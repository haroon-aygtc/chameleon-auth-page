
import React, { useState, useEffect } from 'react';
import { User, Role } from '@/services/types';
import roleService from '@/services/roleService';
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

interface RoleAssignmentModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, roleIds: string[]) => void;
}

const RoleAssignmentModal = ({
  isOpen,
  user,
  onClose,
  onSave,
}: RoleAssignmentModalProps) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const allRoles = await roleService.getAll();
        setRoles(allRoles);
        
        if (user) {
          setSelectedRoles(user.roles || []);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && user) {
      fetchRoles();
    }
  }, [isOpen, user]);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(current => 
      current.includes(roleId)
        ? current.filter(id => id !== roleId)
        : [...current, roleId]
    );
  };

  const handleSave = () => {
    if (user) {
      onSave(user.id, selectedRoles);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Roles to {user.name}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading roles...</p>
            </div>
          ) : (
            <ScrollArea className="h-72">
              <div className="space-y-4">
                {roles.length === 0 ? (
                  <p className="text-center text-muted-foreground">No roles available</p>
                ) : (
                  roles.map((role) => (
                    <div key={role.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={() => handleRoleToggle(role.id)}
                        className="mt-1"
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor={`role-${role.id}`} className="font-medium">
                          {role.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                        {role.permissions.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Has {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
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

export default RoleAssignmentModal;
