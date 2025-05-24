import { email, object, string, pipe, trim, InferInput } from 'valibot';
export const loginSchema = object({
  email: pipe(string(), email(), trim()),
  password: pipe(string(), trim()),
});

export type LoginData = InferInput<typeof loginSchema>;