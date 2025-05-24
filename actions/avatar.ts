'use server'

import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { actionClient } from '@/lib/safe-action';
import { updateAvatarSchema } from '@/lib/schema/personal';
import { eq } from 'drizzle-orm';

export const updateAvatar = actionClient
.schema(updateAvatarSchema)
.action(async ({ parsedInput, ctx }) => {
    await db.update(user).set({ image: parsedInput.link }).where(eq(user.id, ctx.user.id));
});
