
// Mock database service to simulate backend functionality
// This will be easy to replace with a Laravel API integration later

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
let users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    roles: ["admin"],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: "2",
    name: "Content Manager",
    email: "content@example.com",
    roles: ["content-manager"],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-03-25'),
  },
  {
    id: "3",
    name: "Support Staff",
    email: "support@example.com",
    roles: ["support"],
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05'),
  },
];

let roles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access",
    permissions: ["users.view", "users.create", "users.edit", "users.delete", "roles.view", "roles.create", "roles.edit", "roles.delete", "permissions.view", "permissions.create", "permissions.edit", "permissions.delete"],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "content-manager",
    name: "Content Manager",
    description: "Manage content and settings",
    permissions: ["users.view", "roles.view", "permissions.view"],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "support",
    name: "Support Staff",
    description: "Handle customer support",
    permissions: ["users.view"],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

let permissions: Permission[] = [
  {
    id: "users.view",
    name: "View Users",
    description: "Ability to view user list and details",
    category: "Users",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "users.create",
    name: "Create Users",
    description: "Ability to create new users",
    category: "Users",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "users.edit",
    name: "Edit Users",
    description: "Ability to edit user details",
    category: "Users",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "users.delete",
    name: "Delete Users",
    description: "Ability to delete users",
    category: "Users",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "roles.view",
    name: "View Roles",
    description: "Ability to view role list and details",
    category: "Roles",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "roles.create",
    name: "Create Roles",
    description: "Ability to create new roles",
    category: "Roles",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "roles.edit",
    name: "Edit Roles",
    description: "Ability to edit role details",
    category: "Roles",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "roles.delete",
    name: "Delete Roles",
    description: "Ability to delete roles",
    category: "Roles",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "permissions.view",
    name: "View Permissions",
    description: "Ability to view permission list",
    category: "Permissions",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "permissions.create",
    name: "Create Permissions",
    description: "Ability to create new permissions",
    category: "Permissions",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "permissions.edit",
    name: "Edit Permissions",
    description: "Ability to edit permission details",
    category: "Permissions",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: "permissions.delete",
    name: "Delete Permissions",
    description: "Ability to delete permissions",
    category: "Permissions",
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// CRUD operations for Users
export const userService = {
  getAll: () => Promise.resolve([...users]),
  getById: (id: string) => Promise.resolve(users.find(user => user.id === id)),
  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser = {
      ...userData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  },
  update: (id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...userData,
        updatedAt: new Date(),
      };
      return Promise.resolve(users[index]);
    }
    return Promise.reject(new Error('User not found'));
  },
  delete: (id: string) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = users[index];
      users = users.filter(user => user.id !== id);
      return Promise.resolve(deletedUser);
    }
    return Promise.reject(new Error('User not found'));
  },
  assignRoles: (userId: string, roleIds: string[]) => {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        roles: roleIds,
        updatedAt: new Date(),
      };
      return Promise.resolve(users[index]);
    }
    return Promise.reject(new Error('User not found'));
  },
};

// CRUD operations for Roles
export const roleService = {
  getAll: () => Promise.resolve([...roles]),
  getById: (id: string) => Promise.resolve(roles.find(role => role.id === id)),
  create: (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRole = {
      ...roleData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    roles.push(newRole);
    return Promise.resolve(newRole);
  },
  update: (id: string, roleData: Partial<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = roles.findIndex(role => role.id === id);
    if (index !== -1) {
      roles[index] = {
        ...roles[index],
        ...roleData,
        updatedAt: new Date(),
      };
      return Promise.resolve(roles[index]);
    }
    return Promise.reject(new Error('Role not found'));
  },
  delete: (id: string) => {
    const index = roles.findIndex(role => role.id === id);
    if (index !== -1) {
      const deletedRole = roles[index];
      roles = roles.filter(role => role.id !== id);
      return Promise.resolve(deletedRole);
    }
    return Promise.reject(new Error('Role not found'));
  },
  assignPermissions: (roleId: string, permissionIds: string[]) => {
    const index = roles.findIndex(role => role.id === roleId);
    if (index !== -1) {
      roles[index] = {
        ...roles[index],
        permissions: permissionIds,
        updatedAt: new Date(),
      };
      return Promise.resolve(roles[index]);
    }
    return Promise.reject(new Error('Role not found'));
  },
};

// CRUD operations for Permissions
export const permissionService = {
  getAll: () => Promise.resolve([...permissions]),
  getById: (id: string) => Promise.resolve(permissions.find(permission => permission.id === id)),
  create: (permissionData: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPermission = {
      ...permissionData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    permissions.push(newPermission);
    return Promise.resolve(newPermission);
  },
  update: (id: string, permissionData: Partial<Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = permissions.findIndex(permission => permission.id === id);
    if (index !== -1) {
      permissions[index] = {
        ...permissions[index],
        ...permissionData,
        updatedAt: new Date(),
      };
      return Promise.resolve(permissions[index]);
    }
    return Promise.reject(new Error('Permission not found'));
  },
  delete: (id: string) => {
    const index = permissions.findIndex(permission => permission.id === id);
    if (index !== -1) {
      const deletedPermission = permissions[index];
      permissions = permissions.filter(permission => permission.id !== id);
      return Promise.resolve(deletedPermission);
    }
    return Promise.reject(new Error('Permission not found'));
  },
};

// Export types for use in components
export type { User, Role, Permission };
