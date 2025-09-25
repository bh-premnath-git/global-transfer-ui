import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types';
import { authService } from '@/services/authService';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to log in'));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to register'));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      if (!response.success) {
        throw new Error(response.message || 'Logout failed');
      }
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to logout'));
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (!response.success) {
        throw new Error(response.message || 'Unable to fetch user');
      }
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to fetch user'));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('auth_token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('auth_token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('auth_token');
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;