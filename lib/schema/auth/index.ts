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
    confirmPassword: pipe(string(), trim()),
  }),
  forward(
    partialCheck([['password'], ['confirmPassword']], input => input.password === input.confirmPassword, 'Passwords do not match'),
    ['confirmPassword'],
  )
);

export const forgotPasswordSchema = object({
  email: pipe(string(), email(), trim()),
})

export const resetPasswordSchema = pipe(
  object({
    token: pipe(string(), trim()),
    newPassword: pipe(string(), trim(), minLength(8)),
    confirmPassword: pipe(string(), trim())
  }),
  forward(
    partialCheck([['newPassword'], ['confirmPassword']], input => input.newPassword === input.confirmPassword, 'Passwords do not match'),
    ['confirmPassword']
  )
)
export type LoginData = InferInput<typeof loginSchema>;
export type RegisterData = InferInput<typeof registerSchema>;
export type ForgotPasswordData = InferInput<typeof forgotPasswordSchema>;
export type ResetPasswordData = InferInput<typeof resetPasswordSchema>