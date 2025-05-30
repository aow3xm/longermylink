import { InferInput, url, nonEmpty, object, pipe, string, trim } from 'valibot';

export const updateAvatarSchema = object({
    link: pipe(string(), trim())
})

export const generateLinkSchema = object({
    original: pipe(string(), url(), trim(), nonEmpty()),
    path: pipe(string(), trim()),
})
export type GenerateLinkData = InferInput<typeof generateLinkSchema>

export type UpdateAvatarData = InferInput<typeof updateAvatarSchema>