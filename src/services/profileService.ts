import { restClient } from './api/restClient';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse } from '@/types';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  created_at?: string;
  updated_at?: string;
}

/**
 * Profile Service - Handles user profile operations
 * Connects to Profile microservice on port 8004
 */
class ProfileService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      return await restClient.get<UserProfile>(API_ENDPOINTS.PROFILE.GET);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      return await restClient.put<UserProfile>(API_ENDPOINTS.PROFILE.UPDATE, profileData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Health check for Profile service
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      return await restClient.get(API_ENDPOINTS.PROFILE.HEALTH);
    } catch (error) {
      console.error('Profile health check error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
