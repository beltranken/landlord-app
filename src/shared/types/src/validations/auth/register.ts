import { z } from "zod";
import {
  imageSchema,
  optionalAddressSchema,
  passwordSchema,
} from "../reusable";

export const registerRequestSchema = optionalAddressSchema
  .extend({
    organizationId: z.number().optional(),
    email: z.email(),
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    image: imageSchema.optional(),
    phone: z.string().optional(),
    dateOfBirth: z.iso.date().optional(),
  })
  .and(passwordSchema);

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
