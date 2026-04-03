import { z } from "zod/v4";
import { LoginResponse, loginResponseSchema } from "./login";

export const refreshRequestSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshRequest = z.infer<typeof refreshRequestSchema>;

export const refreshResponseSchema = loginResponseSchema;

export type RefreshResponse = LoginResponse;
