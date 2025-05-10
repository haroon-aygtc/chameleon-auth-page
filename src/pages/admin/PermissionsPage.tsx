
import React, { useState, useEffect } from 'react';
import { Permission } from '@/services/types';
import permissionService from '@/services/permissionService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import PermissionTable from '@/components/admin/permissions/PermissionTable';
import PermissionForm from '@/components/admin/permissions/PermissionForm';
import { useToast } from "@/hooks/use-toast";
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const PermissionsPage = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | undefined>(undefined);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
  // Navigation tabs
  const tabs = [
    { label: "Overview", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Roles", path: "/admin/roles" },
    { label: "Permissions", path: "/admin/permissions" },
    { label: "Widget Config", path: "/admin/widget-config" },
    { label: "Context Rules", path: "/admin/context-rules" },
    { label: "Templates", path: "/admin/templates" },
    { label: "Knowledge Base", path: "/admin/knowledge" },
    { label: "Embed Code", path: "/admin/embed" },
    { label: "AI Logs", path: "/admin/logs" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Settings", path: "/admin/settings" },
    { label: "AI Configuration", path: "/admin/ai-config" },
  ];

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
  const handlePermissionSubmit = async (permissionData: Partial<Permission>) => {
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
  };

  // Handle permission deletion
  const handlePermissionDelete = async (permissionId: string) => {
    try {
      await permissionService.delete(permissionId);
      setPermissions(permissions.filter(permission => permission.id !== permissionId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete permission",
        variant: "destructive",
      });
    }
  };

  // Handle analytics toggle
  const handleAnalyticsToggle = (checked: boolean) => {
    setAnalyticsEnabled(checked);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader
          analyticsEnabled={analyticsEnabled}
          onAnalyticsToggle={handleAnalyticsToggle}
        />

        {/* Main Dashboard */}
        <main className="flex-1 p-6 bg-background overflow-auto">
          {/* Navigation Tabs */}
          <AdminNavTabs items={tabs} />

          {showForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PermissionForm
                permission={currentPermission}
                existingCategories={categories}
                onSubmit={handlePermissionSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setCurrentPermission(undefined);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-xl font-bold">Permissions</CardTitle>
                    <p className="text-muted-foreground text-sm">Manage system permissions.</p>
                  </div>
                  <Button
                    onClick={() => {
                      setCurrentPermission(undefined);
                      setShowForm(true);
                    }}
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Permission
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <p>Loading permissions...</p>
                    </div>
                  ) : (
                    <PermissionTable
                      permissions={permissions}
                      onEdit={(permission) => {
                        setCurrentPermission(permission);
                        setShowForm(true);
                      }}
                      onDelete={handlePermissionDelete}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PermissionsPage;
