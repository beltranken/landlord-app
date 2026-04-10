import { pagingRequestSchema } from "@types";
import { z } from "zod/v4";

export default function paginatedRequestWrapper(
  schema: z.ZodObject<any, any> = z.object({}),
) {
  return schema.extend(pagingRequestSchema.shape);
}
