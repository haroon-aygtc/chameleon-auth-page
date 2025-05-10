
import { useState, useEffect, useCallback } from 'react';
import { Permission } from '@/services/types';
import permissionService from '@/services/permissionService';
import { useToast } from "@/hooks/use-toast";

export const usePermissions = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | undefined>(undefined);

  // Get all unique categories from permissions
  const categories = [...new Set(permissions.map(permission => permission.category))];

  // Fetch permissions on component mount
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await permissionService.getAll();
        setPermissions(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch permissions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [toast]);

  // Handle permission form submission
  const handlePermissionSubmit = useCallback(async (permissionData: Partial<Permission>) => {
    try {
      let updatedPermission;
      
      if (currentPermission) {
        // Update existing permission
        updatedPermission = await permissionService.update(currentPermission.id, permissionData);
        setPermissions(permissions.map(permission => 
          permission.id === currentPermission.id ? updatedPermission : permission
        ));
        toast({
          title: "Success",
          description: "Permission updated successfully",
        });
      } else {
        // Create new permission
        updatedPermission = await permissionService.create(permissionData as Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>);
        setPermissions([...permissions, updatedPermission]);
        toast({
          title: "Success",
          description: "Permission created successfully",
        });
      }
      
      setShowForm(false);
      setCurrentPermission(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: currentPermission ? "Failed to update permission" : "Failed to create permission",
        variant: "destructive",
      });
    }
  }, [permissions, currentPermission, toast]);

  // Handle permission deletion
  const handlePermissionDelete = useCallback(async (permissionId: string) => {
    try {
      await permissionService.delete(permissionId);
      setPermissions(permissions.filter(permission => permission.id !== permissionId));
      toast({
        title: "Success",
        description: "Permission deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete permission",
        variant: "destructive",
      });
    }
  }, [permissions, toast]);

  return {
    permissions,
    loading,
    showForm,
    currentPermission,
    categories,
    setShowForm,
    setCurrentPermission,
    handlePermissionSubmit,
    handlePermissionDelete
  };
};
