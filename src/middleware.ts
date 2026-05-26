import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/resume',
];

// Admin-only routes
const adminRoutes = [
  '/dashboard/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session from cookie (simplified - in production use Supabase auth)
  const sessionCookie = request.cookies.get('session')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  // Check if accessing protected routes
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if accessing admin routes
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Redirect to login if accessing protected routes without session
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing admin routes without admin role
  if (isAdminRoute && userRole !== 'super_admin' && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect logged-in users away from auth pages
  if (sessionCookie && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
