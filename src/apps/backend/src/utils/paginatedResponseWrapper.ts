import { z } from "zod";

const paginatedResponseWrapper = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.boolean(),
    messsage: z.string().optional(),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
    hasMore: z.boolean(),
    data: z.array(schema),
  });

export default paginatedResponseWrapper;
