
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Role } from '@/services/types';
import roleService from '@/services/roleService';
import { useToast } from "@/hooks/use-toast";

export function useRoleManagement() {
  const { toast } = useToast();
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
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
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        // Create new role
        await roleService.create(roleData);
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      }
      
      refetchRoles();
      setActiveTab("roles");
      setSelectedRole(null);
    } catch (error) {
      console.error("Error saving role:", error);
      toast({
        title: "Error",
        description: selectedRole ? "Failed to update role" : "Failed to create role",
        variant: "destructive",
      });
    }
  };

  // Handle role deletion
  const handleRoleDelete = async (roleId: string) => {
    try {
      await roleService.delete(roleId);
      refetchRoles();
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  // Handle permission assignment
  const handleAssignPermissions = (role: Role) => {
    setSelectedRole(role);
    setPermissionModalOpen(true);
  };

  // Save permission assignments
  const handleSavePermissionAssignments = async (roleId: string, permissionIds: string[]) => {
    try {
      await roleService.assignPermissions(roleId, permissionIds);
      refetchRoles();
      setPermissionModalOpen(false);
      toast({
        title: "Success",
        description: "Permissions assigned successfully",
      });
    } catch (error) {
      console.error("Error assigning permissions:", error);
      toast({
        title: "Error",
        description: "Failed to assign permissions",
        variant: "destructive",
      });
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
    setActiveTab,
    setPermissionModalOpen,
    setSelectedRole,
    handleRoleSubmit,
    handleRoleDelete,
    handleAssignPermissions,
    handleSavePermissionAssignments,
    handleEditRole,
    handleCreateRole,
    handleCancelForm
  };
}
