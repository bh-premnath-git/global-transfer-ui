import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '@/store/slices/authSlice';
import { LoginCredentials, RegisterCredentials } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const authState = useAppSelector((state) => state.auth);

  // Get current user query
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => dispatch(getCurrentUser()).unwrap(),
    enabled: !!localStorage.getItem('auth_token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => dispatch(loginUser(credentials)).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => dispatch(registerUser(credentials)).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => dispatch(logoutUser()).unwrap(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.loading || isLoadingUser,
    error: authState.error,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};