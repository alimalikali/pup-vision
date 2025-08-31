import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access-token')?.value

  // If no token → block protected routes
  if (!accessToken && (pathname.startsWith('/dashboard') || pathname.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If token exists → block auth routes (login/signup)
  if (accessToken && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
}
