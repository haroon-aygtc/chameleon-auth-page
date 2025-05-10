import React from 'react';
import { User } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List, Settings, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import UserTable from '@/components/admin/users/UserTable';
import UserForm from '@/components/admin/users/UserForm';

interface UserManagementProps {
  users: User[];
  loading: boolean;
  activeTab: string;
  currentUser?: User;
  onTabChange: (value: string) => void;
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onAssignRoles: (user: User) => void;
  onUserSubmit: (userData: Partial<User>) => void;
  onCancelForm: () => void;
}

const UserManagement = ({
  users,
  loading,
  activeTab,
  currentUser,
  onTabChange,
  onCreateUser,
  onEditUser,
  onDeleteUser,
  onAssignRoles,
  onUserSubmit,
  onCancelForm
}: UserManagementProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-bold">User Management</CardTitle>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage system users and their role assignments
          </p>
        </div>
        <Button
          onClick={onCreateUser}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="users" className="flex items-center">
              <List className="mr-2 h-4 w-4" />
              User List
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              {currentUser ? 'Edit User' : 'Create User'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading users...</p>
                </div>
              ) : (
                <UserTable
                  users={users}
                  onEdit={onEditUser}
                  onDelete={onDeleteUser}
                  onAssignRoles={onAssignRoles}
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
              <UserForm
                user={currentUser}
                onSubmit={async (userData) => {
                  try {
                    await onUserSubmit(userData);
                  } catch (error) {
                    // Let the form component handle validation errors
                    throw error;
                  }
                }}
                onCancel={onCancelForm}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
