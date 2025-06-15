import { clerkMiddleware } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/:locale',
    '/:locale/sign-in(.*)',
    '/:locale/sign-up(.*)',
    '/:locale/products(.*)',
  ],

  async beforeAuth(req: NextRequest) {
    const intlResult = intlMiddleware(req);
    if (intlResult?.status !== 200) return intlResult;

    const sessionResult = await updateSession(req);
    if (sessionResult?.status !== 200) return sessionResult;
  }
});

// You must write matcher yourself:
export const config = {
  matcher: [
    '/', // <= IMPORTANT: include root "/" explicitly
    '/(vi|en)/:path*',
    '/(api|trpc)(.*)',
  ],
};
