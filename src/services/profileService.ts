import api from './api';
import { User } from './types';

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
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
}

const profileService = {
  /**
   * Update the authenticated user's profile
   */
  updateProfile: async (data: ProfileUpdateData) => {
    // Create a copy of the data to avoid modifying the original
    const processedData = { ...data };

    // Convert notification_preferences to a JSON string if it exists
    if (processedData.notification_preferences) {
      processedData.notification_preferences = JSON.stringify(processedData.notification_preferences);
    }

    const response = await api.put<{ message: string; user: User }>('/profile', processedData);

    // Update the stored user data
    if (response.data.user) {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        const updatedUser = { ...parsedUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }

    return response.data;
  },

  /**
   * Update the authenticated user's avatar
   */
  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<{ message: string; avatar_url: string; user: User }>(
      '/profile/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Update the stored user data
    if (response.data.user) {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        const updatedUser = { ...parsedUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }

    return response.data;
  },
};

export default profileService;
