import { wso2AuthService } from './wso2AuthService';
import { LoginCredentials, RegisterCredentials, User, ApiResponse } from '@/types';

/**
 * Auth Service - Delegates to WSO2 Identity Server
 * All authentication now goes through WSO2 (Port 9444)
 */
class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return wso2AuthService.login(credentials);
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return wso2AuthService.register(credentials);
  }

  async logout(): Promise<ApiResponse<null>> {
    return wso2AuthService.logout();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return wso2AuthService.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  // Token refresh using WSO2
  async refreshToken(): Promise<string | null> {
    return wso2AuthService.refreshToken();
  }
}

export const authService = new AuthService();