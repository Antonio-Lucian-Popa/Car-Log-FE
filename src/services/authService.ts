/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@/types';
import { tokenService } from './tokenService';
import { apiClient } from './apiClient';

class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>('/auth/login', { email, password });

      console.log('Login response:', response);

      
      // Store tokens
      tokenService.setTokens(response.data.accessToken, response.data.refreshToken, response.data.expiresIn);

      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const response = await apiClient.post<{
        user: User;
      }>('/auth/register', { email, password, name });

      const { user } = response.data;
      
      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    // Check if we have valid tokens first
    if (!tokenService.hasValidTokens()) {
      throw new Error('No valid authentication tokens');
    }

    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      // If getting current user fails, clear tokens
      tokenService.clearTokens();
      throw new Error('Failed to get current user');
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = tokenService.getRefreshToken();
      
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear tokens locally
      tokenService.clearTokens();
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = tokenService.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>('/auth/refresh', { refreshToken });

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
      
      tokenService.setTokens(accessToken, newRefreshToken, expiresIn);
      return accessToken;
    } catch (error) {
      tokenService.clearTokens();
      throw new Error('Token refresh failed');
    }
  }

  isAuthenticated(): boolean {
    return tokenService.hasValidTokens();
  }
}

export const authService = new AuthService();