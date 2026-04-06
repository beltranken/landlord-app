import { z } from "zod";

const responseWrapper = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.boolean(),
    error: z.string().optional(),
    data: schema,
  });

export default responseWrapper;
