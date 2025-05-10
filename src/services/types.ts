
/**
 * User interface representing a system user with associated roles
 */
export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Role interface representing a permission group that can be assigned to users
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color?: string;
  isSystem?: boolean;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Permission interface representing a single action that can be allowed within the system
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isSystem?: boolean;
  createdBy?: string;
  module?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Permission category grouping to better organize permissions
 */
export interface PermissionCategory {
  name: string;
  description?: string;
  permissions: Permission[];
}

/**
 * Resource access level type
 */
export type AccessLevel = 'none' | 'read' | 'write' | 'admin';

/**
 * User session information
 */
export interface UserSession {
  userId: string;
  token: string;
  expiresAt: string;
  permissions: string[];
}
