import { wso2AuthService } from './wso2AuthService';
import { mockAuthService } from './mockAuthService';
import { LoginCredentials, RegisterCredentials, User, ApiResponse } from '@/types';

// Toggle between mock and real WSO2 auth
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Log on service initialization
console.log('🔐 Auth Service initialized');
console.log('  VITE_USE_MOCK_AUTH:', import.meta.env.VITE_USE_MOCK_AUTH);
console.log('  USE_MOCK_AUTH:', USE_MOCK_AUTH);
console.log('  Provider:', USE_MOCK_AUTH ? 'MOCK' : 'Profile Service (Port 8004)');
console.log('  Auth Base URL:', import.meta.env.VITE_AUTH_BASE_URL);
console.log('  Token URL:', import.meta.env.VITE_AUTH_TOKEN_URL);

/**
 * Auth Service - Delegates to WSO2 Identity Server or Mock (based on config)
 * Set VITE_USE_MOCK_AUTH=true in .env for development without WSO2
 */
class AuthService {
  private authProvider = USE_MOCK_AUTH ? mockAuthService : wso2AuthService;

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('🔑 Login attempt:', {
      email: credentials.email,
      provider: USE_MOCK_AUTH ? 'MOCK' : 'WSO2',
      wso2Url: import.meta.env.VITE_WSO2_BASE_URL
    });
    
    if (USE_MOCK_AUTH) {
      console.log('⚠️ Using MOCK authentication (VITE_USE_MOCK_AUTH=true)');
    } else {
      console.log('✅ Using REAL WSO2 authentication');
      console.log('  Token endpoint:', import.meta.env.VITE_WSO2_TOKEN_URL);
    }
    
    return this.authProvider.login(credentials);
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    if (USE_MOCK_AUTH) {
      console.log('🔧 Using MOCK authentication (VITE_USE_MOCK_AUTH=true)');
    }
    return this.authProvider.register(credentials);
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.authProvider.logout();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.authProvider.getCurrentUser();
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

  // Token refresh
  async refreshToken(): Promise<string | null> {
    return this.authProvider.refreshToken();
  }
}

export const authService = new AuthService();