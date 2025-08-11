'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken, removeAuthToken } from '@/utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = () => {
    const token = getAccessToken();
    
    if (token) {
      try {
        // Basic JWT token validation (check if it exists and is not expired)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          // Token expired
          removeAuthToken();
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Invalid token format
        console.error('Invalid token format:', error);
        removeAuthToken();
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
