
import api from './api';
import { Permission } from './types';

const permissionService = {
  /**
   * Fetch all permissions from the backend
   */
  getAll: async (): Promise<Permission[]> => {
    try {
      const response = await api.get('/permissions');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific permission by ID
   */
  getById: async (id: string): Promise<Permission> => {
    try {
      const response = await api.get(`/permissions/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching permission ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new permission
   */
  create: async (permissionData: Partial<Permission>): Promise<Permission> => {
    try {
      const response = await api.post('/permissions', permissionData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing permission
   */
  update: async (id: string, permissionData: Partial<Permission>): Promise<Permission> => {
    try {
      const response = await api.put(`/permissions/${id}`, permissionData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating permission ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a permission
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/permissions/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting permission ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get permissions by category
   */
  getByCategory: async (category: string): Promise<Permission[]> => {
    try {
      const response = await api.get(`/permissions/category/${category}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching permissions for category ${category}:`, error);
      throw error;
    }
  }
};

export default permissionService;
