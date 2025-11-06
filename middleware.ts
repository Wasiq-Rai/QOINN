import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/utils/security'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public/(.*)',
  '/api/webhook/(.*)'
])

const sensitiveRoutes = [
  '/api/users',
  '/api/metrics',
  '/api/portfolios',
  '/api/performance',
  '/api/media',
  '/api/theme',
  '/api/newsletter/subscribers',
  '/api/equity',
  '/api/model-launch',
];

export default clerkMiddleware(async (auth, request) => {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if it's a public route
    if (isPublicRoute(request)) {
      return NextResponse.next();
    }

    // Protect all non-public routes with authentication
    await auth.protect();

    // Additional security for sensitive routes
    const isSensitiveRoute = sensitiveRoutes.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );

    if (isSensitiveRoute) {
      // Verify CSRF token for mutation requests
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        const csrfToken = request.headers.get('X-CSRF-Token');
        if (!csrfToken) {
          return new NextResponse(
            JSON.stringify({ error: 'Missing CSRF token' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      // Add security headers
      const response = NextResponse.next();
      response.headers.set('X-DNS-Prefetch-Control', 'off');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'same-origin');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Content-Security-Policy', 
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
      );

      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}