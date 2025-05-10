
import { useState, useEffect } from 'react';
import { User } from '@/services/types';
import userService from '@/services/userService';
import { useToast } from "@/hooks/use-toast";

export function useUserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
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
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
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

  return {
    users,
    loading,
    showForm,
    currentUser,
    roleModalOpen,
    selectedUser,
    setShowForm,
    setCurrentUser,
    handleUserSubmit,
    handleUserDelete,
    handleAssignRoles,
    handleSaveRoleAssignments,
    setRoleModalOpen
  };
}
