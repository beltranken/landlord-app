import { z } from "zod/v4";

export const passwordSchema = z
  .object({
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type PasswordSchema = z.infer<typeof passwordSchema>;
