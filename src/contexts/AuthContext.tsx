import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/api';
import { authService } from '@/services';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
