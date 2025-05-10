import React, { useState, useEffect } from 'react';
import { User, Role } from '@/services/types';
import roleService from '@/services/roleService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { showSuccessToast, handleApiError } from '@/utils/toast-utils';
import VisualRoleAssignment from './VisualRoleAssignment';

interface UserRoleAssignmentProps {
  user: User | null;
  onSave: (userId: string, roleIds: string[]) => Promise<void>;
  onBack: () => void;
}

const UserRoleAssignment = ({
  user,
  onSave,
  onBack
}: UserRoleAssignmentProps) => {

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const allRoles = await roleService.getAll();
        setRoles(allRoles);

        if (user) {
          // Handle both string role IDs and role objects
          const roleIds = user.roles?.map(role =>
            typeof role === 'string' ? role : role.id
          ) || [];
          setSelectedRoles(roleIds);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        handleApiError(error, "Failed to load roles. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRoles();
    }
  }, [user]);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(current =>
      current.includes(roleId)
        ? current.filter(id => id !== roleId)
        : [...current, roleId]
    );
  };

  const handleSave = async () => {
    if (user) {
      setIsSaving(true);
      try {
        await onSave(user.id, selectedRoles);
        showSuccessToast(
          "Roles updated",
          `Roles for ${user.name} have been updated successfully.`
        );
      } catch (error) {
        handleApiError(error, "Failed to update roles. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">No user selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 mr-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">Assign Roles</CardTitle>
            <CardDescription>
              Manage roles for {user.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading roles...</span>
          </div>
        ) : (
          <VisualRoleAssignment
            user={user}
            roles={roles}
            selectedRoles={selectedRoles}
            onRoleToggle={handleRoleToggle}
          />
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          {selectedRoles.length} of {roles.length} roles assigned
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="min-w-[100px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserRoleAssignment;
