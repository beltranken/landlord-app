import z from "zod/v4";

const paramSchema = (paramName: string) => {
  return z.object({
    [paramName]: z.coerce.number().int(),
  });
};

export default paramSchema;
