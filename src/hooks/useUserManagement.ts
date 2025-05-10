
import { useState, useEffect } from 'react';
import { User } from '@/services/types';
import userService from '@/services/userService';
import { showSuccessToast, handleApiError } from "@/utils/toast-utils";

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("users");
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);
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
      handleApiError(error, "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Handle user form submission
  const handleUserSubmit = async (userData: Partial<User>) => {
    // Ensure roles is an array of strings
    const processedUserData = {
      ...userData,
      roles: userData.roles || []
    };

    let updatedUser;

    if (currentUser) {
      // Update existing user
      updatedUser = await userService.update(currentUser.id, processedUserData);

      setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
      showSuccessToast("Success", "User updated successfully");
    } else {
      // Create new user
      updatedUser = await userService.create(processedUserData as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);
      setUsers([...users, updatedUser]);
      showSuccessToast("Success", "User created successfully");
    }

    setActiveTab("users");
    setCurrentUser(undefined);

    return updatedUser;
  };

  // Handle user deletion
  const handleUserDelete = async (userId: string) => {
    try {
      await userService.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
      showSuccessToast("Success", "User deleted successfully");
    } catch (error) {
      handleApiError(error, "Failed to delete user");
    }
  };

  // Handle role assignment
  const handleAssignRoles = (user: User) => {
    setSelectedUser(user);
    setShowRoleAssignment(true);
  };

  // Save role assignments
  const handleSaveRoleAssignments = async (userId: string, roleIds: string[]) => {
    try {
      const updatedUser = await userService.assignRoles(userId, roleIds);
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
      setShowRoleAssignment(false);
      showSuccessToast("Success", "Roles assigned successfully");
    } catch (error) {
      handleApiError(error, "Failed to assign roles");
    }
  };

  // Handle create user
  const handleCreateUser = () => {
    setCurrentUser(undefined);
    setActiveTab("edit");
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    // Make a deep copy to avoid reference issues
    const userCopy = {
      ...user,
      // Convert role objects to role IDs if needed
      roles: user.roles?.map(role =>
        typeof role === 'string' ? role : role.id
      ) || []
    };

    setCurrentUser(userCopy);
    setActiveTab("edit");
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setActiveTab("users");
    setCurrentUser(undefined);
  };

  return {
    users,
    loading,
    currentUser,
    selectedUser,
    activeTab,
    showRoleAssignment,
    setCurrentUser,
    setActiveTab,
    handleUserSubmit,
    handleUserDelete,
    handleAssignRoles,
    handleSaveRoleAssignments,
    setShowRoleAssignment,
    handleCreateUser,
    handleEditUser,
    handleCancelForm
  };
}
