'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { AuthUser } from '@types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, status, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state on app load
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Handle authentication state changes
    if (status === 'authenticated' && user) {
      // User is authenticated, check if they need onboarding
      if (user.isNew) {
        console.log('[AuthProvider] User is new, redirecting to onboarding');
        router.push('/onboarding');
      } else {
        console.log(
          '[AuthProvider] User is authenticated and completed onboarding'
        );
        // User is authenticated and has completed onboarding
        // They can access the dashboard
      }
    } else if (status === 'unauthenticated') {
      console.log('[AuthProvider] User is not authenticated');
      // User is not authenticated, they should be redirected to login by middleware
    }
  }, [status, user, router]);

  const value = {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user,
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
