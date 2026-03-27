import z from "zod";

export const pagingRequestSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(50),
});

export type PagingRequest = z.infer<typeof pagingRequestSchema>;
