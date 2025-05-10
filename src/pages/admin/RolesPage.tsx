
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import RoleTable from '@/components/admin/roles/RoleTable';
import RoleForm from '@/components/admin/roles/RoleForm';
import PermissionAssignmentModal from '@/components/admin/roles/PermissionAssignmentModal';
import { useToast } from "@/hooks/use-toast";
import { Plus, List, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import roleService from '@/services/roleService';
import { Role } from '@/services/types';

const RolesPage = () => {
  const { toast } = useToast();
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("roles");
  
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-xl font-bold">Roles Management</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Define roles and assign permissions to control access to system features
                </p>
              </div>
              <Button
                onClick={handleCreateRole}
                className="flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Role
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="roles" className="flex items-center">
                    <List className="mr-2 h-4 w-4" />
                    Role List
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    {selectedRole ? 'Edit Role' : 'Create Role'}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="roles">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <p>Loading roles...</p>
                      </div>
                    ) : (
                      <RoleTable
                        roles={roles}
                        onEdit={handleEditRole}
                        onDelete={handleRoleDelete}
                        onAssignPermissions={handleAssignPermissions}
                      />
                    )}
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="edit">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RoleForm
                      role={selectedRole ?? undefined}
                      onSubmit={handleRoleSubmit}
                      onCancel={handleCancelForm}
                    />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Permission Assignment Modal */}
      <PermissionAssignmentModal
        isOpen={permissionModalOpen}
        role={selectedRole}
        onClose={() => setPermissionModalOpen(false)}
        onSave={handleSavePermissionAssignments}
      />
    </div>
  );
};

export default RolesPage;
