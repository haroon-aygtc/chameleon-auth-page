
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Role } from '@/services/types';
import roleService from '@/services/roleService';
import { showSuccessToast, handleApiError } from "@/utils/toast-utils";

export function useRoleManagement() {
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [showPermissionAssignment, setShowPermissionAssignment] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<string>("roles");

  // Fetch roles with React Query
  const {
    data: roles = [],
    isLoading,
    refetch: refetchRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getAll,
  });

  // Handle role form submission
  const handleRoleSubmit = async (roleData: Partial<Role>) => {
    try {
      if (selectedRole && selectedRole.id) {
        // Update existing role
        await roleService.update(selectedRole.id, roleData);
        showSuccessToast("Success", "Role updated successfully");
      } else {
        // Create new role
        await roleService.create(roleData);
        showSuccessToast("Success", "Role created successfully");
      }

      refetchRoles();
      setActiveTab("roles");
      setSelectedRole(null);
    } catch (error) {
      console.error("Error saving role:", error);
      handleApiError(
        error,
        selectedRole ? "Failed to update role" : "Failed to create role"
      );
    }
  };

  // Handle role deletion
  const handleRoleDelete = async (roleId: string) => {
    try {
      await roleService.delete(roleId);
      refetchRoles();
      showSuccessToast("Success", "Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
      handleApiError(error, "Failed to delete role");
    }
  };

  // Handle permission assignment
  const handleAssignPermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionAssignment(true);
  };

  // Save permission assignments
  const handleSavePermissionAssignments = async (roleId: string, permissionIds: string[]) => {
    try {
      await roleService.assignPermissions(roleId, permissionIds);
      refetchRoles();
      setShowPermissionAssignment(false);
      showSuccessToast("Success", "Permissions assigned successfully");
    } catch (error) {
      console.error("Error assigning permissions:", error);
      handleApiError(error, "Failed to assign permissions");
    }
  };

  // Handle edit role
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setActiveTab("edit");
  };

  // Handle create role
  const handleCreateRole = () => {
    setSelectedRole(null);
    setActiveTab("edit");
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setActiveTab("roles");
    setSelectedRole(null);
  };

  return {
    roles,
    isLoading,
    permissionModalOpen,
    selectedRole,
    activeTab,
    showPermissionAssignment,
    setActiveTab,
    setPermissionModalOpen,
    setSelectedRole,
    setShowPermissionAssignment,
    handleRoleSubmit,
    handleRoleDelete,
    handleAssignPermissions,
    handleSavePermissionAssignments,
    handleEditRole,
    handleCreateRole,
    handleCancelForm
  };
}
