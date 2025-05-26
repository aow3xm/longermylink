'use server'

import { db } from '@/lib/db';
import { link } from '@/lib/db/schema';
import { actionClient } from '@/lib/safe-action';
import { generateLinkSchema } from '@/lib/schema/personal';

export const generateLink = actionClient
    .schema(generateLinkSchema)
    .action(async ({parsedInput, ctx})=>{
        const withHttps = parsedInput.original.startsWith('http')? parsedInput.original : `https://${parsedInput.original}`;
        const isSignedIn = 'user' in ctx
        const [path] = await db.insert(link).values({
            ...parsedInput,
            original: withHttps,
            userId: isSignedIn ? ctx.user.id : null,
        }).returning()

        return path;
    })