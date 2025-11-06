import { LoginCredentials, RegisterCredentials, User, ApiResponse } from '@/types';

interface WSO2TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface WSO2UserInfo {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

class WSO2AuthService {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private authUrl: string;
  private userInfoUrl: string;

  constructor() {
    this.clientId = import.meta.env.VITE_WSO2_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_WSO2_CLIENT_SECRET || '';
    
    // Use Profile Service (port 8004) instead of direct WSO2 (port 9444)
    const authBaseUrl = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8004';
    this.tokenUrl = import.meta.env.VITE_AUTH_TOKEN_URL || `${authBaseUrl}/oauth2/token`;
    this.authUrl = import.meta.env.VITE_AUTH_LOGIN_URL || `${authBaseUrl}/auth/login`;
    this.userInfoUrl = import.meta.env.VITE_AUTH_PROFILE_URL || `${authBaseUrl}/auth/profile`;
  }

  /**
   * Exchanges username/password for OAuth2 token using Resource Owner Password Credentials flow
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // OAuth2 Resource Owner Password Credentials Grant
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      formData.append('scope', 'openid profile email');

      const basicAuth = btoa(`${this.clientId}:${this.clientSecret}`);

      const tokenResponse = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: formData.toString(),
      });

      console.log('📨 WSO2 Response status:', tokenResponse.status, tokenResponse.statusText);
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        console.error('❌ WSO2 Login failed:', tokenResponse.status, errorData);
        throw new Error(errorData.error_description || 'Invalid credentials');
      }

      const tokenData: WSO2TokenResponse = await tokenResponse.json();
      console.log('✅ WSO2 token received successfully');
      console.log('  Access token (first 20 chars):', tokenData.access_token?.substring(0, 20) + '...');

      // Fetch user info using access token
      const user = await this.getUserInfo(tokenData.access_token);

      // Store tokens
      this.storeTokens(tokenData.access_token, tokenData.refresh_token);

      return {
        success: true,
        data: {
          user,
          token: tokenData.access_token,
        },
        message: 'Login successful',
      };
    } catch (error) {
      console.error('WSO2 Login error:', error);
      return {
        success: false,
        data: null as any,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  /**
   * Register a new user - this typically requires a separate user management API
   * WSO2 Identity Server has SCIM2 API for user management
   */
  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Use Profile Service for registration
      const baseUrl = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8004';
      const registerUrl = `${baseUrl}/auth/register`;

      console.log('📝 Registering user via Profile Service:', registerUrl);
      
      const registerData = {
        username: credentials.email,
        password: credentials.password,
        name: credentials.name,
        email: credentials.email,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      };

      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
      }

      // After successful registration, login
      return this.login({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      console.error('WSO2 Registration error:', error);
      return {
        success: false,
        data: null as any,
        message: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  /**
   * Get user information from WSO2 using access token
   */
  async getUserInfo(accessToken: string): Promise<User> {
    const response = await fetch(this.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo: WSO2UserInfo = await response.json();

    return {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name || userInfo.given_name || userInfo.email,
      avatar: undefined,
    };
  }

  /**
   * Get current user from stored token
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const user = await this.getUserInfo(token);

      return {
        success: true,
        data: user,
        message: 'User retrieved successfully',
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        data: null as any,
        message: error instanceof Error ? error.message : 'Failed to get user',
      };
    }
  }

  /**
   * Logout - revoke tokens
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      const token = this.getToken();
      
      if (token) {
        // Revoke token endpoint
        const revokeUrl = this.tokenUrl.replace('/token', '/revoke');
        const basicAuth = btoa(`${this.clientId}:${this.clientSecret}`);

        await fetch(revokeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
          },
          body: new URLSearchParams({
            token,
            token_type_hint: 'access_token',
          }).toString(),
        }).catch(err => console.warn('Token revocation failed:', err));
      }

      this.clearTokens();

      return {
        success: true,
        data: null,
        message: 'Logout successful',
      };
    } catch (error) {
      // Still clear tokens even if revocation fails
      this.clearTokens();
      return {
        success: true,
        data: null,
        message: 'Logout successful',
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', refreshToken);

      const basicAuth = btoa(`${this.clientId}:${this.clientSecret}`);

      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const tokenData: WSO2TokenResponse = await response.json();
      this.storeTokens(tokenData.access_token, tokenData.refresh_token);

      return tokenData.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return null;
    }
  }

  // Token management helpers
  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const wso2AuthService = new WSO2AuthService();
