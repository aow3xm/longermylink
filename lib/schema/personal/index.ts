import { InferInput, object, pipe, string, trim } from 'valibot';

export const updateAvatarSchema = object({
    link: pipe(string(), trim())
})

export const generateLinkSchema = object({
    from: pipe(string(), trim()),
    to: pipe(string(), trim()),
})
export type GenerateLinkData = InferInput<typeof generateLinkSchema>

export type UpdateAvatarData = InferInput<typeof updateAvatarSchema>