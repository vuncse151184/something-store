import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// i18n middleware
const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  console.log('🔍 Middleware - URL:', req.nextUrl.pathname);
  
  // Only handle i18n - no authentication required
  const intlResult = intlMiddleware(req);
  
  if (intlResult) {
    console.log('- i18n redirect/response');
    return intlResult;
  }
  
  console.log('- ✅ Proceeding without auth');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(vi|en)/:path*',
    '/(api|trpc)(.*)',
  ],
};