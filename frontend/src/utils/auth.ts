// Utility functions for handling authentication tokens
export const setAuthToken = (token: string, userId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', userId);
    
    // Also set as httpOnly cookie for middleware access
    document.cookie = `access_token=${token}; path=/; max-age=${12 * 60 * 60}; SameSite=strict`;
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    
    // Remove cookie
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

export const getAccessToken = (): string | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('access_token');
  } catch (error) {
    console.error('Error retrieving access token from localStorage:', error);
    return null;
  }
};
