import { z } from "zod/v4";

export const baseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

z.globalRegistry.add(baseResponseSchema, { id: "BaseResponse" });

export type BaseResponse = z.infer<typeof baseResponseSchema>;

export const baseResponseWithPagingSchema = baseResponseSchema.extend({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  hasMore: z.boolean(),
});

z.globalRegistry.add(baseResponseWithPagingSchema, {
  id: "BaseResponseWithPaging",
});

export type BaseResponseWithPaging = z.infer<
  typeof baseResponseWithPagingSchema
>;
