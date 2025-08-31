'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export function GoogleAuthButton() {
  const router = useRouter();
  const { setAuthenticated } = useAuthStore();

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const result = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: response.access_token,
          }),
        });

        if (result.ok) {
          const data = await result.json();
          
          // Update the auth store with user information
          if (data.user) {
            console.log('Google auth successful, user data:', data.user);
            
            // Create a user object that matches your User interface
            const userData = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              avatar: data.user.picture,
              profileCompletion: data.user.profileCompletion || 0,
              memberSince: new Date().toISOString(),
              lastActive: new Date().toISOString(),
              subscription: {
                plan: "free" as const,
                status: "active" as const,
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              }
            };

            console.log('Created user data object:', userData);

            // Update the auth store
            setAuthenticated(userData);
            
            // Redirect based on whether user is new or existing
            if (data.user.isNewUser) {
              console.log('New user detected, redirecting to onboarding');
              router.push('/onboarding');
            } else {
              console.log('Existing user detected, redirecting to dashboard');
              router.push('/dashboard');
            }
          } else {
            console.error('No user data received from Google auth');
          }
        } else {
          console.error('Google auth failed');
        }
      } catch (error) {
        console.error('Google auth error:', error);
      }
    },
    onError: () => {
      console.error('Google login failed');
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => login()}
      className="w-full"
    >
      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
      </svg>
      Continue with Google
    </Button>
  );
} 