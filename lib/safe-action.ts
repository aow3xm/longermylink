import { createSafeActionClient } from 'next-safe-action';
import { valibotAdapter } from 'next-safe-action/adapters/valibot';
import { auth } from './auth/server';
import { headers } from 'next/headers';

export const actionClient = createSafeActionClient({
  validationAdapter: valibotAdapter(),
}).use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  return next({ ctx: session });
});
