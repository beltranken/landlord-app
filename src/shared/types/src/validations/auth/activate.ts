import { z } from "zod/v4";

export const activateRequestSchema = z.object({
  token: z.string(),
});

export type ActivateRequest = z.infer<typeof activateRequestSchema>;
