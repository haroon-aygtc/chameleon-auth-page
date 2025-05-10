
import React, { useState, useEffect } from 'react';
import { User, userService } from '@/services/mockDatabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import UserTable from '@/components/admin/users/UserTable';
import UserForm from '@/components/admin/users/UserForm';
import RoleAssignmentModal from '@/components/admin/users/RoleAssignmentModal';
import { useToast } from "@/hooks/use-toast";
import { Plus, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Handle user form submission
  const handleUserSubmit = async (userData: Partial<User>) => {
    try {
      let updatedUser;
      
      if (currentUser) {
        // Update existing user
        updatedUser = await userService.update(currentUser.id, userData);
        setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // Create new user
        updatedUser = await userService.create(userData as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);
        setUsers([...users, updatedUser]);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      
      setShowForm(false);
      setCurrentUser(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: currentUser ? "Failed to update user" : "Failed to create user",
        variant: "destructive",
      });
    }
  };

  // Handle user deletion
  const handleUserDelete = async (userId: string) => {
    try {
      await userService.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // Handle role assignment
  const handleAssignRoles = (user: User) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  };

  // Save role assignments
  const handleSaveRoleAssignments = async (userId: string, roleIds: string[]) => {
    try {
      const updatedUser = await userService.assignRoles(userId, roleIds);
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
      setRoleModalOpen(false);
      toast({
        title: "Success",
        description: "Roles assigned successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign roles",
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
              <UserForm
                user={currentUser}
                onSubmit={handleUserSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setCurrentUser(undefined);
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
                    <CardTitle className="text-xl font-bold">Users</CardTitle>
                    <p className="text-muted-foreground text-sm">Manage system users and their roles.</p>
                  </div>
                  <Button
                    onClick={() => {
                      setCurrentUser(undefined);
                      setShowForm(true);
                    }}
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New User
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <p>Loading users...</p>
                    </div>
                  ) : (
                    <UserTable
                      users={users}
                      onEdit={(user) => {
                        setCurrentUser(user);
                        setShowForm(true);
                      }}
                      onDelete={handleUserDelete}
                      onAssignRoles={handleAssignRoles}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>

      {/* Role Assignment Modal */}
      <RoleAssignmentModal
        isOpen={roleModalOpen}
        user={selectedUser}
        onClose={() => setRoleModalOpen(false)}
        onSave={handleSaveRoleAssignments}
      />
    </div>
  );
};

export default UsersPage;
