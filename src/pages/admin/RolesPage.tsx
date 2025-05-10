
import React, { useState, useEffect } from 'react';
import { Role, roleService } from '@/services/mockDatabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import RoleTable from '@/components/admin/roles/RoleTable';
import RoleForm from '@/components/admin/roles/RoleForm';
import PermissionAssignmentModal from '@/components/admin/roles/PermissionAssignmentModal';
import { useToast } from "@/hooks/use-toast";
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const RolesPage = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | undefined>(undefined);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
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

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.getAll();
        setRoles(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch roles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [toast]);

  // Handle role form submission
  const handleRoleSubmit = async (roleData: Partial<Role>) => {
    try {
      let updatedRole;
      
      if (currentRole) {
        // Update existing role
        updatedRole = await roleService.update(currentRole.id, roleData);
        setRoles(roles.map(role => role.id === currentRole.id ? updatedRole : role));
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        // Create new role
        updatedRole = await roleService.create(roleData as Omit<Role, 'id' | 'createdAt' | 'updatedAt'>);
        setRoles([...roles, updatedRole]);
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      }
      
      setShowForm(false);
      setCurrentRole(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: currentRole ? "Failed to update role" : "Failed to create role",
        variant: "destructive",
      });
    }
  };

  // Handle role deletion
  const handleRoleDelete = async (roleId: string) => {
    try {
      await roleService.delete(roleId);
      setRoles(roles.filter(role => role.id !== roleId));
    } catch (error) {
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
      const updatedRole = await roleService.assignPermissions(roleId, permissionIds);
      setRoles(roles.map(role => role.id === roleId ? updatedRole : role));
      setPermissionModalOpen(false);
      toast({
        title: "Success",
        description: "Permissions assigned successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign permissions",
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
              <RoleForm
                role={currentRole}
                onSubmit={handleRoleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setCurrentRole(undefined);
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
                    <CardTitle className="text-xl font-bold">Roles</CardTitle>
                    <p className="text-muted-foreground text-sm">Manage role definitions and their permissions.</p>
                  </div>
                  <Button
                    onClick={() => {
                      setCurrentRole(undefined);
                      setShowForm(true);
                    }}
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Role
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <p>Loading roles...</p>
                    </div>
                  ) : (
                    <RoleTable
                      roles={roles}
                      onEdit={(role) => {
                        setCurrentRole(role);
                        setShowForm(true);
                      }}
                      onDelete={handleRoleDelete}
                      onAssignPermissions={handleAssignPermissions}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
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
