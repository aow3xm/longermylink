import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const middleware = async (req: NextRequest) => {
  return intlMiddleware(req);
};

export const config = {
  matcher: '/((?!api|l/|trpc|_next|_vercel|.*\\..*).*)',
};

export default middleware;
