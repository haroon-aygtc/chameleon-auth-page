import { useState } from 'react';
import { User } from '@/services/types';
import profileService, { ProfileUpdateData } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccessToast, handleApiError } from '@/utils/toast-utils';

export function useProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  // Update profile information
  const updateProfile = async (profileData: ProfileUpdateData) => {
    setLoading(true);
    
    try {
      const response = await profileService.updateProfile(profileData);
      
      // Update the user in the auth context
      if (response.user) {
        setUser(response.user);
      }
      
      showSuccessToast('Profile Updated', 'Your profile has been updated successfully');
      return response.user;
    } catch (error) {
      handleApiError(error, 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update avatar
  const updateAvatar = async (file: File) => {
    setAvatarLoading(true);
    
    try {
      const response = await profileService.updateAvatar(file);
      
      // Update the user in the auth context
      if (response.user) {
        setUser(response.user);
      }
      
      showSuccessToast('Avatar Updated', 'Your profile picture has been updated successfully');
      return response.avatar_url;
    } catch (error) {
      handleApiError(error, 'Failed to update profile picture');
      throw error;
    } finally {
      setAvatarLoading(false);
    }
  };
  
  return {
    user,
    loading,
    avatarLoading,
    updateProfile,
    updateAvatar
  };
}
