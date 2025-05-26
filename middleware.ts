import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { paths } from './config/page';
import { routing } from './i18n/routing';

const protectedPaths = [paths.profile]
const authPaths = Object.values(paths.auth)
const withLocaleRegex = (paths: string[])=> RegExp(`^(/(${routing.locales.join('|')}))?(${paths.flatMap(p => (p === '/' ? ['', '/'] : p)).join('|')})/?$`, 'i');
//=====================================================================//

const intlMiddleware = createIntlMiddleware(routing);

const middleware = async (req: NextRequest) => {
  const isAuthenticated = getSessionCookie(req)
  const isProtectedPath = withLocaleRegex(protectedPaths).test(req.nextUrl.pathname)

  if(!isAuthenticated && isProtectedPath){
    return NextResponse.redirect(new URL(paths.auth.login, req.url))
  }

  const isAuthPath = withLocaleRegex(authPaths).test(req.nextUrl.pathname)
  
  if(isAuthenticated && isAuthPath){
    return NextResponse.redirect(new URL(paths.home, req.url))
  }

  return intlMiddleware(req)
};

export const config = {
  matcher: '/((?!api|l/|trpc|_next|_vercel|.*\\..*).*)',
};

export default middleware;
