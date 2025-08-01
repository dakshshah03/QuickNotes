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
