import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthContextType } from '@/types';
import { authService } from '@/services/authService';
import { tokenService } from '@/services/tokenService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we have valid tokens
      if (!tokenService.hasValidTokens()) {
        setLoading(false);
        return;
      }

      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      tokenService.clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);
    setUser(userData);

    // Redirect to dashboard after successful login
    navigate('/dashboard');
  };

  const register = async (email: string, password: string, name: string) => {
    const userData = await authService.register(email, password, name);
    setUser(userData);

    // Redirect to dashboard after successful registration
    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      
      // Redirect to auth page after logout
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout request fails, clear local state
      setUser(null);
      navigate('/auth');
    }
  };

  const loginWithGoogle = () => {
    // Store current location to redirect back after Google auth
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth') {
      localStorage.setItem('redirectAfterAuth', currentPath);
    }
    
    window.location.href = '/api/auth/google';
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}