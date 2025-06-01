import { InferInput, nonEmpty, number, object, pipe, string, trim } from 'valibot';

export const updateAvatarSchema = object({
    link: pipe(string(), trim())
})

export const generateLinkSchema = object({
    original: pipe(string(), trim(), nonEmpty()),
})

export const deleteLinkSchema = object({
    id: pipe(number())
})
export type GenerateLinkData = InferInput<typeof generateLinkSchema>
export type DeleteLinkData = InferInput<typeof deleteLinkSchema>

export type UpdateAvatarData = InferInput<typeof updateAvatarSchema>