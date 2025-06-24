// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './../src/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Skip internationalization for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  if (pathname === '/sign-in' || '/sign-up' || '/sso-callback') {
    // Skip internationalization for sign-in and sign-up pages
    return NextResponse.next();
   }

  // Apply internationalization to all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Set a cookie to remember the previous locale for all requests that have a locale prefix
    '/(vi|en)/:path*',
    // Enable redirects that add missing locales but EXCLUDE api routes
    '/((?!api|_next|_vercel|.*\\.).*)'
  ]
};