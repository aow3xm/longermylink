import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from 'next-safe-action';
import { valibotAdapter } from 'next-safe-action/adapters/valibot';
import { auth } from './auth/server';
import { headers } from 'next/headers';
import { APIError } from 'better-auth/api';

export const actionClient = createSafeActionClient({
  validationAdapter: valibotAdapter(),
  handleServerError: e => {
    if (e instanceof APIError) {
      return e.body?.message;
    }

    if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new APIError('UNAUTHORIZED', {
      message: 'Unauthorized',
    });
  }

  return next({ ctx: session });
});
