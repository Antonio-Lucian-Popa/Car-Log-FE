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
        expiresAt: number;
      }>('/auth/login', { email, password });

      console.log('Login response:', response);

      
      // Store tokens
      tokenService.setTokens(response.accessToken, response.refreshToken, response.expiresAt);

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

      const { user } = response;
      
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
      return response;
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

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response;
      
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

  async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>('/auth/update', userData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update user');
    }
  }

  async deleteUser(): Promise<void> {
    try {
      await apiClient.delete('/auth/delete');
      tokenService.clearTokens();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
}

export const authService = new AuthService();