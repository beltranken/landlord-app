import { z } from "zod";

export const activateRequestSchema = z.object({
  token: z.string(),
});

export type ActivateRequest = z.infer<typeof activateRequestSchema>;
