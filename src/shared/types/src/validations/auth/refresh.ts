import { z } from "zod";
import { LoginResponse, loginResponseSchema } from "./login";

export const refreshRequestSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshRequest = z.infer<typeof refreshRequestSchema>;

export const refreshResponseSchema = loginResponseSchema;

export type RefreshResponse = LoginResponse;
