import { LoginCredentials, RegisterCredentials, User, ApiResponse } from '@/types';

/**
 * Mock Auth Service - For development/testing without WSO2
 * 
 * To use: Change import in src/services/authService.ts
 * import { mockAuthService as wso2AuthService } from './mockAuthService';
 */
class MockAuthService {
  private mockUsers: Map<string, { password: string; user: User }> = new Map([
    ['admin@example.com', {
      password: 'admin',
      user: {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        avatar: undefined,
      },
    }],
    ['test@example.com', {
      password: 'test123',
      user: {
        id: '2',
        email: 'test@example.com',
        name: 'Test User',
        avatar: undefined,
      },
    }],
  ]);

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const userRecord = this.mockUsers.get(credentials.email);
    
    if (!userRecord || userRecord.password !== credentials.password) {
      return {
        success: false,
        data: null as any,
        message: 'Invalid email or password',
      };
    }

    const token = `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store mock token
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', `refresh-${token}`);
    localStorage.setItem('mock_user', JSON.stringify(userRecord.user));

    return {
      success: true,
      data: {
        user: userRecord.user,
        token,
      },
      message: 'Login successful (mock mode)',
    };
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (this.mockUsers.has(credentials.email)) {
      return {
        success: false,
        data: null as any,
        message: 'User already exists',
      };
    }

    const newUser: User = {
      id: `mock-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      avatar: undefined,
    };

    // Store new mock user
    this.mockUsers.set(credentials.email, {
      password: credentials.password,
      user: newUser,
    });

    // Auto-login after registration
    return this.login({
      email: credentials.email,
      password: credentials.password,
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('auth_token');
    const mockUserStr = localStorage.getItem('mock_user');

    if (!token || !mockUserStr) {
      return {
        success: false,
        data: null as any,
        message: 'No authentication token found',
      };
    }

    try {
      const user = JSON.parse(mockUserStr);
      return {
        success: true,
        data: user,
        message: 'User retrieved successfully',
      };
    } catch {
      return {
        success: false,
        data: null as any,
        message: 'Invalid user data',
      };
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('mock_user');

    return {
      success: true,
      data: null,
      message: 'Logout successful (mock mode)',
    };
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    const newToken = `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('refresh_token', `refresh-${newToken}`);

    return newToken;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const mockAuthService = new MockAuthService();
