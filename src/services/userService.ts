
import api from './api';
import { User } from './types';

const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },
  
  create: async (userData: Partial<User>) => {
    const response = await api.post('/users', userData);
    return response.data.data;
  },
  
  update: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
    return true;
  },
  
  assignRoles: async (userId: string, roleIds: string[]) => {
    const response = await api.post(`/users/${userId}/roles`, { roles: roleIds });
    return response.data.data;
  }
};

export default userService;
