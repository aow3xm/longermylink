import * as schema from '@/lib/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { getLocale } from 'next-intl/server';
import { resend } from '..';
import { SignUpTemplate } from '@/components/emails/SignUpTemplate';

const i18nMessage: Record<string, string> = {
  'Invalid email or password': 'Thông tin đăng nhập không hợp lệ',
  'User already exists': 'Tài khoản đã tồn tại',
};
//==================================================================//
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: 'Longermylink <noreply@rs.o0ong.me>',
        to: user.email,
        subject: 'Verify your email',
        react: await SignUpTemplate({ name: user.name, verificationLink: url }),
      });

      if (error) {
        throw new Error('Failed to send verification email');
      }
    },
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
      console.log(" server.ts:52 - locale:", locale)
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
