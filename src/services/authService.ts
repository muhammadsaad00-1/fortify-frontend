import apiClient, { setTokens, clearTokens, isAuthenticated } from './apiClient';
import { AuthResponse, User } from '@/types/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
}

interface UpdateProfileDetailsData {
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  medical_conditions?: string;
  current_medications?: string;
  injuries?: string;
  pain_areas?: string;
  exercise_restrictions?: string;
  primary_goal?: string;
  secondary_goals?: string;
  target_body_composition?: string;
  preferred_training_style?: string;
  available_equipment?: string;
  training_location?: string;
  session_duration_preference?: string;
  weekly_availability?: string;
}

export const authService = {
  /**
   * Register a new user
   * POST /api/auth/register/
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register/', data);
    
    // Store tokens
    if (response.tokens) {
      setTokens(response.tokens.access, response.tokens.refresh);
    }
    
    return response;
  },

  /**
   * Login user with email and password
   * POST /api/token/
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Django JWT uses 'email' or 'username' field
    const response = await apiClient.post<{ access: string; refresh: string }>(
      '/api/token/',
      {
        username: credentials.email, // Django JWT typically uses 'username'
        password: credentials.password,
      }
    );

    // Store tokens
    setTokens(response.access, response.refresh);

    // Fetch user profile after login
    const user = await authService.getProfile();

    return {
      message: 'Login successful',
      user: user,
      tokens: {
        access: response.access,
        refresh: response.refresh,
      },
    };
  },

  /**
   * Logout user (clear local tokens)
   */
  logout: () => {
    clearTokens();
  },

  /**
   * Get current user profile
   * GET /api/auth/profile/
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/api/auth/profile/');
  },

  /**
   * Update user profile (basic info)
   * PUT /api/auth/profile/update/
   */
  updateProfile: async (data: UpdateProfileData): Promise<{ message: string; user: User }> => {
    return apiClient.put('/api/auth/profile/update/', data);
  },

  /**
   * Partially update user profile
   * PATCH /api/auth/profile/update/
   */
  patchProfile: async (data: Partial<UpdateProfileData>): Promise<{ message: string; user: User }> => {
    return apiClient.patch('/api/auth/profile/update/', data);
  },

  /**
   * Get detailed user profile (intake form data)
   * GET /api/auth/profile/details/
   */
  getProfileDetails: async () => {
    return apiClient.get('/api/auth/profile/details/');
  },

  /**
   * Update detailed user profile (intake form)
   * PUT /api/auth/profile/details/update/
   */
  updateProfileDetails: async (data: UpdateProfileDetailsData) => {
    return apiClient.put('/api/auth/profile/details/update/', data);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return isAuthenticated();
  },
};

export default authService;
