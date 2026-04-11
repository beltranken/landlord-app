import z from "zod/v4";

const paramSchema = (...args: string[]) => {
  const shape: Record<string, any> = {};
  args.forEach((paramName) => {
    shape[paramName] = z.coerce.number().int();
  });
  return z.object(shape);
};

export default paramSchema;
