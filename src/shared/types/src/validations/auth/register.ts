import { z } from "zod/v4";
import {
  imageSchema,
  optionalAddressSchema,
  passwordSchema,
} from "../reusable";

export const registerRequestSchema = z
  .object({
    organizationId: z.number().optional(),
    email: z.email(),
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    image: imageSchema.optional(),
    phone: z.string().optional(),
    dateOfBirth: z.iso.date().optional(),
  })
  .and(passwordSchema)
  .and(optionalAddressSchema);

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
