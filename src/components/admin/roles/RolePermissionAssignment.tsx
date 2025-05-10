import React, { useState, useEffect } from 'react';
import { Role, Permission } from '@/services/types';
import permissionService from '@/services/permissionService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showSuccessToast, handleApiError } from "@/utils/toast-utils";
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import VisualPermissionSelector from './VisualPermissionSelector';

interface RolePermissionAssignmentProps {
  role: Role | null;
  onSave: (roleId: string, permissionIds: string[]) => Promise<void>;
  onBack: () => void;
}

const RolePermissionAssignment = ({
  role,
  onSave,
  onBack
}: RolePermissionAssignmentProps) => {

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAll(),
    enabled: !!role,
  });

  // Initialize selected permissions when role changes
  useEffect(() => {
    if (role && role.permissions) {
      setSelectedPermissions(role.permissions);
    }
  }, [role]);

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(current =>
      current.includes(permissionId)
        ? current.filter(id => id !== permissionId)
        : [...current, permissionId]
    );
  };

  // Select all permissions
  const handleSelectAll = () => {
    setSelectedPermissions(permissions.map(p => p.id));
  };

  // Deselect all permissions
  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  // Handle save
  const handleSave = async () => {
    if (role) {
      setIsSaving(true);
      try {
        await onSave(role.id, selectedPermissions);
        showSuccessToast(
          "Permissions updated",
          `Permissions for ${role.name} have been updated successfully.`
        );
      } catch (error) {
        handleApiError(error, "Failed to update permissions. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!role) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">No role selected</p>
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
            <CardTitle className="text-xl">
              <span className="bg-primary/10 text-primary p-1 rounded">
                {role.name}
              </span>
              <span className="ml-2">Role Permissions</span>
            </CardTitle>
            <CardDescription>
              Select the permissions you want to assign to this role. Permissions control what actions users with this role can perform.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading permissions...</span>
          </div>
        ) : (
          <VisualPermissionSelector
            permissions={permissions}
            selectedPermissions={selectedPermissions}
            onPermissionToggle={handlePermissionToggle}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          {selectedPermissions.length} of {permissions.length} permissions selected
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

export default RolePermissionAssignment;
