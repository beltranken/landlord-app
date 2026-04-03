import z from "zod/v4";

export const pagingRequestSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(50),
});

export type PagingRequest = z.infer<typeof pagingRequestSchema>;
