
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      toast.error('Your session has expired. Please login again.');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } 
    // Handle 404 Not Found
    else if (error.response && error.response.status === 404) {
      console.error('Resource not found:', error.config?.url);
    }
    // Handle 422 Validation errors
    else if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        Object.values(validationErrors).forEach((errorMessages: any) => {
          errorMessages.forEach((errorMessage: string) => {
            toast.error(errorMessage);
          });
        });
      } else {
        toast.error(message);
      }
    } 
    // Handle server errors
    else if (error.response && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    } 
    // Handle other errors
    else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
