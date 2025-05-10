
import api from './api';
import { Permission } from './types';

const permissionService = {
  getAll: async () => {
    const response = await api.get('/permissions');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/permissions/${id}`);
    return response.data.data;
  },
  
  create: async (permissionData: Partial<Permission>) => {
    const response = await api.post('/permissions', permissionData);
    return response.data.data;
  },
  
  update: async (id: string, permissionData: Partial<Permission>) => {
    const response = await api.put(`/permissions/${id}`, permissionData);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/permissions/${id}`);
    return true;
  }
};

export default permissionService;
