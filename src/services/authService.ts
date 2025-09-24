import { restClient } from './api/restClient';
import { API_ENDPOINTS } from '@/constants';
import { LoginCredentials, RegisterCredentials, User, ApiResponse } from '@/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return restClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return restClient.post(API_ENDPOINTS.AUTH.REGISTER, credentials);
  }

  async logout(): Promise<ApiResponse<null>> {
    return restClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return restClient.get(API_ENDPOINTS.AUTH.ME);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }
}

export const authService = new AuthService();