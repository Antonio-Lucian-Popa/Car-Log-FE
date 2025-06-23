interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRES_AT_KEY = 'expires_at';

  setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    if(!accessToken || !refreshToken || expiresIn <= 0) {
      throw new Error('Invalid token data');
    }
    const expiresAt = Date.now() + (expiresIn * 1000);
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expiresAt) return true;
    
    // Consider token expired 5 minutes before actual expiry
    return Date.now() > (parseInt(expiresAt) - 5 * 60 * 1000);
  }

  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
  }

  hasValidTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken() && !this.isTokenExpired());
  }
}

export const tokenService = new TokenService();