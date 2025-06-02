import { routing } from '@/i18n/routing';
import { authClient } from '@/lib/auth/client';
import { link } from '@/lib/db/schema';

export type Link = typeof link.$inferSelect

export type AuthErrorCode = keyof typeof authClient.$ERROR_CODES

export type Locale = typeof routing.locales[number]

export type GetLinksResponse = {
  error?: string;
  data?: {
    links: Link[];
    next: number | null;
  };
};
