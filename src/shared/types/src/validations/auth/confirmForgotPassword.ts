import { z } from "zod";
import { passwordSchema } from "../reusable";

export const confirmForgotPasswordRequestSchema = passwordSchema.extend({
  token: z.string(),
});

export type ConfirmForgotPasswordRequest = z.infer<
  typeof confirmForgotPasswordRequestSchema
>;
