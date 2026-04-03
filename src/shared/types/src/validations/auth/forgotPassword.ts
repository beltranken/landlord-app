import { z } from "zod/v4";

export const forgotPasswordRequestSchema = z.object({
  email: z.email(),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
