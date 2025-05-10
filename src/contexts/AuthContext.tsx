import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '@/services/authService';
import { useNavigate } from 'react-router-dom';

// Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
}

// Define the context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Get the stored user or fetch from API
          const userData = authService.getUser();
          if (userData) {
            // Ensure the user has a roles array
            if (!userData.roles) {
              userData.roles = ['Admin']; // Temporarily assign Admin role for testing
            }
            setUser(userData);
          } else {
            // If we have a token but no user data, fetch it
            const currentUser = await authService.getCurrentUser();
            // Ensure the user has a roles array
            if (currentUser && !currentUser.roles) {
              currentUser.roles = ['Admin']; // Temporarily assign Admin role for testing
            }
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear any invalid auth data
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });

      // Ensure the user has a roles array
      if (response.user && !response.user.roles) {
        response.user.roles = ['Admin']; // Temporarily assign Admin role for testing
      }

      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });

      // Ensure the user has a roles array
      if (response.user && !response.user.roles) {
        response.user.roles = ['Admin']; // Temporarily assign Admin role for testing
      }

      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Create the context value object
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    login,
    register,
    logout,
    hasPermission,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
