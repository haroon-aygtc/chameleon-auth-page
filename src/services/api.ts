
import axios from 'axios';

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
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Handle 404 Not Found
    else if (error.response && error.response.status === 404) {
      console.error('Resource not found:', error.config?.url);
    }

    // Enhance error object with formatted validation errors
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        // Add formatted validation errors to the error object
        error.validationErrors = validationErrors;

        // Create a single formatted message with all validation errors
        const errorMessages: string[] = [];
        Object.values(validationErrors).forEach((messages: any) => {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          }
        });

        if (errorMessages.length > 0) {
          error.formattedValidationErrors = errorMessages;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
