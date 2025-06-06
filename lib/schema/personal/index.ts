import { InferInput, nonEmpty, number, object, pipe, regex, string, trim } from 'valibot';

const urlRegex = new RegExp(
  '\\b(?:https?://)?(?:www\\.)?[\\w-]+(\\.[\\w-]+)+(/[\\w-./?%&=]*)?\\b'
);
export const updateAvatarSchema = object({
    link: pipe(string(), trim())
})

export const generateLinkSchema = object({
    original: pipe(string(), trim(), nonEmpty(), regex(urlRegex, 'Invalid URL')),
})

export const deleteLinkSchema = object({
    id: pipe(number())
})
export type GenerateLinkData = InferInput<typeof generateLinkSchema>
export type DeleteLinkData = InferInput<typeof deleteLinkSchema>

export type UpdateAvatarData = InferInput<typeof updateAvatarSchema>