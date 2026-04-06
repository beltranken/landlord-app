import { z } from "zod/v4";

const createResponseWrapper = (
  idKey: string,
  base: z.ZodObject<any, any> = z.object({}),
) => base.extend({ [idKey]: z.number().int() });

export default createResponseWrapper;
