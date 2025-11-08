import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard-add-listing',
  '/dashboard-bookmarks',
  '/dashboard-messages',
  '/dashboard-my-bookings',
  '/dashboard-my-listings',
  '/dashboard-my-profile',
  '/dashboard-reviews',
  '/dashboard-user',
  '/dashboard-wallet',
];

// Auth routes that should redirect if already logged in
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if pathname starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  
  // Get token from cookies (Firebase Auth sets this)
  const token = request.cookies.get('auth-token')?.value;
  
  // For protected routes, check if user is authenticated
  // Note: Actual auth verification happens in API routes using Firebase Admin SDK
  // This is just a basic check. Full auth verification should be done server-side
  if (isProtectedRoute && !token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // For auth routes, redirect to dashboard if already authenticated
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard-user', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

