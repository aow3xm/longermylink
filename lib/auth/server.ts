import { ForgotPasswordTemplate } from '@/components/emails/ForgotPasswordTemplate';
import { SignUpTemplate } from '@/components/emails/SignUpTemplate';
import { routing } from '@/i18n/routing';
import { AuthErrorCode, Locale } from '@/types';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { resend } from '..';
import { db } from '../db';
import * as schema from '@/lib/db/schema';


const i18n: Record<AuthErrorCode, string> = {
  ACCOUNT_NOT_FOUND: 'Tài khoản không tồn tại',
  CREDENTIAL_ACCOUNT_NOT_FOUND: 'Tài khoản không tồn tại',
  EMAIL_NOT_VERIFIED: 'Email chưa được xác nhận',
  EMAIL_CAN_NOT_BE_UPDATED: 'Không thể cập nhật email',
  FAILED_TO_CREATE_SESSION: 'Không thể tạo phiên đăng nhập',
  FAILED_TO_CREATE_USER: 'Không thể tạo tài khảon',
  FAILED_TO_GET_SESSION: 'Không thể lấy phiên đăng nhập',
  FAILED_TO_GET_USER_INFO: 'Không thể lấy thông tin người dùng',
  FAILED_TO_UNLINK_LAST_ACCOUNT: 'Không thể huỷ liên kết tài khoản',
  FAILED_TO_UPDATE_USER: 'Không thể cập nhật thông tin người dùng',
  ID_TOKEN_NOT_SUPPORTED: 'Token ID không hỗ trợ',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_EMAIL_OR_PASSWORD: 'Thông tin đăng nhập không hợp lệ',
  INVALID_PASSWORD: 'Mật khẩu không hợp lệ',
  INVALID_TOKEN: 'Token không hợp lệ',
  PASSWORD_TOO_LONG: 'Mật khẩu quá dài',
  PASSWORD_TOO_SHORT: 'Mật khẩu quá ngắn',
  PROVIDER_NOT_FOUND: 'Oauth provider không tồn tại',
  SESSION_EXPIRED: 'Phiên đăng nhập hết hạn',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'Tài khoản đã được liên kết',
  USER_ALREADY_EXISTS: 'Email đã tồn tại',
  USER_EMAIL_NOT_FOUND: 'Email không tồn tại',
  USER_NOT_FOUND: 'Tài khoản không tồn tại'
}
//==================================================================//
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.NEXT_PUBLIC_TRUSTED_ORIGIN!],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: 'Longermylink <noreply@rs.o0ong.me>',
        to: user.email,
        subject: 'Reset your password',
        react: await ForgotPasswordTemplate({ name: user.name, resetLink: url }),
      });

      if (error) {
        console.error(error)
        throw new Error(error.message);
      }
    },
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
        console.error(error)
        throw new Error(error.message);
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
      let locale: Locale = 'en'
      const error = ctx.context.returned as APIError;
      const localeCookie = ctx.getCookie('NEXT_LOCALE');
      
      if(localeCookie && routing.locales.includes(localeCookie as Locale)){
        locale = localeCookie as Locale
      }

      if(locale === 'vi' && error && error.body && error.body.code && error.body.code in i18n){
        throw new APIError(error.status, {
          ...error.body,
          message: i18n[error.body.code as AuthErrorCode]
        })
      }
    }),
  },

  plugins: [nextCookies()],
});
