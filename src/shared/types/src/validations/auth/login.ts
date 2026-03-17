import { z } from "zod";
import { baseResponseSchema } from "../reusable/base";
import { authDataSchema } from "./auth";

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = baseResponseSchema.extend({
  data: authDataSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginResponseData = z.infer<typeof authDataSchema>;
