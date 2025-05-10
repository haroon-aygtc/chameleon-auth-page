
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: any;
  access_token: string;
  token_type: string;
}

const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/register', data);
    
    // Store token and user data
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/login', credentials);
    
    // Store token and user data
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/logout');
    } finally {
      // Remove token and user data regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/user');
    return response.data.user;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
  
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
