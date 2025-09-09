import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access-token')?.value;
  const refreshToken = request.cookies.get('refresh-token')?.value;

  // Check if this is a protected route
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/matches') || pathname.startsWith('/interested') || pathname.startsWith('/onboarding');

  // If no tokens at all → block protected routes
  if (!accessToken && !refreshToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If we have tokens, validate them by calling the check endpoint
  if ((accessToken || refreshToken) && isProtectedRoute) {
    try {
      const response = await fetch(new URL('/api/auth/check', request.url), {
        method: 'GET',
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
      });

      // If check fails, redirect to login
      if (!response.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch {
      // If validation fails, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If token exists → block auth routes (login/signup)
  if (accessToken && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/signup', '/matches/:path*', '/interested/:path*', '/onboarding/:path*'],
};
