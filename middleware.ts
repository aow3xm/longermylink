import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);
const domain = process.env.NEXT_PUBLIC_BASE_URL!.split('https://')[1];

const middleware = async (req: NextRequest) => {
  const host = req.headers.get('host');
  const isSubdomain = host !== domain && host !== `www.${domain}`;

  if (!isSubdomain) {
    return intlMiddleware(req);
  }

  const subdomain = host!.replace(`.${domain}`, '');
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-subdomain', subdomain);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
};

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

export default middleware;
