import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type Login = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({ token: z.string() });

export type LoginResponse = z.infer<typeof loginResponseSchema>;
