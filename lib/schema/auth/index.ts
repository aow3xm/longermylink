import { email, forward, InferInput, minLength, object, partialCheck, pipe, string, trim } from 'valibot';

export const loginSchema = object({
  email: pipe(string(), email(), trim()),
  password: pipe(string(), trim()),
});

export const registerSchema = pipe(
  object({
    email: pipe(string(), email(), trim()),
    name: pipe(string(), trim()),
    password: pipe(string(), trim(), minLength(8)),
    confirmPassword: pipe(string(), trim(), minLength(8)),
  }),
  forward(
    partialCheck([['password'], ['confirmPassword']], input => input.password === input.confirmPassword, 'Passwords do not match'),
    ['confirmPassword'],
  )
);

export type LoginData = InferInput<typeof loginSchema>;
export type RegisterData = InferInput<typeof registerSchema>;