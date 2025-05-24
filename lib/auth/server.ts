import * as schema from '@/lib/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { getLocale } from 'next-intl/server';

const i18nMessage: Record<string, string> = {
  'Invalid email or password': 'Thông tin đăng nhập không hợp lệ',
};
//==================================================================//
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  hooks: {
    after: createAuthMiddleware(async ctx => {
      const locale = await getLocale();
      const error = ctx.context.returned as APIError;
      if (locale === 'vi' && error && error.body && error.body.message && error.body.message in i18nMessage) {
        throw new APIError(error.status, {
          ...error.body,
          message: i18nMessage[error.body.message],
        });
      }
    }),
  },
});
