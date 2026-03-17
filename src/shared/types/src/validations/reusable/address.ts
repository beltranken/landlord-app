import { z } from "zod";

export const addressSchema = z.object({
  address1: z.string().max(255),
  address2: z.string().max(255).optional(),
  city: z.string().max(255),
  state: z.string().max(255),
  postalCode: z.string().max(20),
  country: z.string().max(255),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type Address = z.infer<typeof addressSchema>;

export const optionalAddressSchema = addressSchema.partial();

export type OptionalAddress = z.infer<typeof optionalAddressSchema>;
