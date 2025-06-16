import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Define public routes using createRouteMatcher
const isPublicRoute = createRouteMatcher([
  '/',
  '/:locale',
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/:locale/products(.*)',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Handle internationalization first
  const intlResult = intlMiddleware(req);
  if (intlResult?.status !== 200) return intlResult;

  // Handle Supabase session
  const sessionResult = await updateSession(req);
  if (sessionResult?.status !== 200) return sessionResult;

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/', // <= IMPORTANT: include root "/" explicitly
    '/(vi|en)/:path*',
    '/(api|trpc)(.*)',
  ],
};