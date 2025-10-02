import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email({
    message: 'Please provide a valid email',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
