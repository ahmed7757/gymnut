import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define protected routes
const protectedRoutes = [
    '/dashboard',
    '/meals',
    '/workouts',
    '/progress',
    '/settings',
    '/profile'
];

// Define public routes that should redirect if authenticated
const authRoutes = [
    '/login',
    '/register',
    '/forgot-password'
];

// Define routes that should redirect authenticated users to dashboard
const redirectToDashboardRoutes = [
    '/' // Root route - redirect authenticated users to dashboard
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the JWT token without using Prisma
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        cookieName: process.env.NODE_ENV === 'production'
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token'
    });

    // Debug logging
    console.log(`[Middleware] Path: ${pathname}, Token: ${token ? 'exists' : 'null'}`);
    console.log(`[Middleware] AUTH_SECRET exists: ${!!process.env.AUTH_SECRET}`);
    console.log(`[Middleware] Cookies:`, request.cookies.getAll().map(c => c.name));

    if (token) {
        console.log(`[Middleware] Token details:`, {
            id: token.id,
            email: token.email,
            exp: token.exp
        });
    }

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if the route is an auth route
    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if the route should redirect authenticated users to dashboard
    const isRedirectToDashboardRoute = redirectToDashboardRoutes.some(route =>
        pathname === route
    );

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !token) {
        console.log(`[Middleware] Redirecting to login from ${pathname}`);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes to dashboard
    if (isAuthRoute && token) {
        console.log(`[Middleware] Redirecting to dashboard from ${pathname}`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect authenticated users from root route to dashboard
    if (isRedirectToDashboardRoute && token) {
        console.log(`[Middleware] Redirecting authenticated user from ${pathname} to dashboard`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Add security headers
    const response = NextResponse.next();

    // Security headers following 2025 best practices
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // CSP for enhanced security
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
