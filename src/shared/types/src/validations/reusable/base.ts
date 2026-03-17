import { z } from "zod";

export const baseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

z.globalRegistry.add(baseResponseSchema, { id: "BaseResponse" });

export type BaseResponse = z.infer<typeof baseResponseSchema>;
