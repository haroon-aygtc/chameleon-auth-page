
import api from './api';
import { Role } from './types';

const roleService = {
  /**
   * Fetch all roles from the backend
   */
  getAll: async (): Promise<Role[]> => {
    try {
      const response = await api.get('/roles');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific role by ID
   */
  getById: async (id: string): Promise<Role> => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching role ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new role
   */
  create: async (roleData: Partial<Role>): Promise<Role> => {
    try {
      const response = await api.post('/roles', roleData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing role
   */
  update: async (id: string, roleData: Partial<Role>): Promise<Role> => {
    try {
      const response = await api.put(`/roles/${id}`, roleData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating role ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a role
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/roles/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting role ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Assign permissions to a role
   */
  assignPermissions: async (roleId: string, permissionIds: string[]): Promise<Role> => {
    try {
      const response = await api.post(`/roles/${roleId}/permissions`, { permissions: permissionIds });
      return response.data.data;
    } catch (error) {
      console.error(`Error assigning permissions to role ${roleId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get users assigned to a role
   */
  getRoleUsers: async (roleId: string): Promise<any[]> => {
    try {
      const response = await api.get(`/roles/${roleId}/users`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching users for role ${roleId}:`, error);
      throw error;
    }
  }
};

export default roleService;
