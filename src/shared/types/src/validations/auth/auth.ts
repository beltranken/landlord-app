import { z } from "zod";

export const authDataSchema = z.object({
  userId: z.number(),
  organizationId: z.number(),
  token: z.string(),
  refreshToken: z.string(),
  jwtAccessExpiry: z.number(),
  jwtRefreshExpiry: z.number(),
});

export type AuthData = z.infer<typeof authDataSchema>;
