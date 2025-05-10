
/**
 * User interface representing a system user with associated roles
 */
export interface User {
  id: string;
  name: string;
  email: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  roles: string[] | any[]; // Allow for role objects
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  job_title?: string;
  company?: string;
  theme_preference?: 'light' | 'dark' | 'system';
  notification_preferences?: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
    security_alerts?: boolean;
  };
  last_login_at?: string;
  email_verified_at?: string;
  // Password fields (only used for creation/updates)
  password?: string;
  password_confirmation?: string;
  current_password?: string;
  // Support both camelCase and snake_case formats
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Role interface representing a permission group that can be assigned to users
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[] | any[]; // Allow for permission objects
  color?: string;
  isSystem?: boolean;
  is_system?: boolean; // Support snake_case
  userCount?: number;
  user_count?: number; // Support snake_case
  // Support both camelCase and snake_case formats
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
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
  is_system?: boolean; // Support snake_case
  createdBy?: string;
  created_by?: string; // Support snake_case
  module?: string;
  // Support both camelCase and snake_case formats
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
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
