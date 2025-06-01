'use server';

import { db } from '@/lib/db';
import { link } from '@/lib/db/schema';
import { actionClient } from '@/lib/safe-action';
import { deleteLinkSchema, generateLinkSchema } from '@/lib/schema/personal';
import { generateRandomPath } from '@/utils';
import { and, eq } from 'drizzle-orm';

export const generateLink = actionClient.schema(generateLinkSchema).action(async ({ parsedInput, ctx }) => {
  const path = generateRandomPath();
  const isSignedIn = 'user' in ctx;
  const [result] = await db
    .insert(link)
    .values({
      ...parsedInput,
      userId: isSignedIn ? ctx.user.id : null,
      path,
    })
    .returning();

  return result;
});

export const deleteLink = actionClient.schema(deleteLinkSchema).action(async ({ parsedInput: { id }, ctx }) => {
  const isSignedIn = 'user' in ctx;
  if (!isSignedIn) throw new Error('Unauthorized');
  await db.delete(link).where(and(eq(link.id, id), eq(link.userId, ctx.user.id)));
});
