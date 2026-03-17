import { z } from "zod";

export const forgotPasswordRequestSchema = z.object({
  email: z.email(),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
