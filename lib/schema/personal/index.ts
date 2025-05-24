import { InferInput, object, pipe, string, trim } from 'valibot';

export const updateAvatarSchema = object({
    link: pipe(string(), trim())
})

export type UpdateAvatarData = InferInput<typeof updateAvatarSchema>