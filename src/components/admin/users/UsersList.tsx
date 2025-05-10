
import React from 'react';
import { User } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import UserTable from '@/components/admin/users/UserTable';
import UserForm from '@/components/admin/users/UserForm';

interface UsersListProps {
  users: User[];
  loading: boolean;
  showForm: boolean;
  currentUser?: User;
  onAddNewClick: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onAssignRoles: (user: User) => void;
  onFormSubmit: (userData: Partial<User>) => void;
  onFormCancel: () => void;
}

const UsersList = ({
  users,
  loading,
  showForm,
  currentUser,
  onAddNewClick,
  onEditUser,
  onDeleteUser,
  onAssignRoles,
  onFormSubmit,
  onFormCancel
}: UsersListProps) => {
  return showForm ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <UserForm
        user={currentUser}
        onSubmit={onFormSubmit}
        onCancel={onFormCancel}
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
            onClick={onAddNewClick}
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
              onEdit={onEditUser}
              onDelete={onDeleteUser}
              onAssignRoles={onAssignRoles}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsersList;
