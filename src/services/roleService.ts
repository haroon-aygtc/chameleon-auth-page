
import api from './api';
import { Role } from './types';

const roleService = {
  getAll: async () => {
    const response = await api.get('/roles');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/roles/${id}`);
    return response.data.data;
  },
  
  create: async (roleData: Partial<Role>) => {
    const response = await api.post('/roles', roleData);
    return response.data.data;
  },
  
  update: async (id: string, roleData: Partial<Role>) => {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/roles/${id}`);
    return true;
  },
  
  assignPermissions: async (roleId: string, permissionIds: string[]) => {
    const response = await api.post(`/roles/${roleId}/permissions`, { permissions: permissionIds });
    return response.data.data;
  }
};

export default roleService;
