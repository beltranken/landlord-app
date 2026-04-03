import { z } from "zod/v4";

export const addressSchema = z.object({
  address1: z.string().max(255),
  address2: z.string().max(255).optional().nullable(),
  city: z.string().max(255),
  state: z.string().max(255),
  postalCode: z.string().max(20),
  country: z.string().max(255),
  latitude: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),
});

export type Address = z.infer<typeof addressSchema>;

export const optionalAddressSchema = z.object({
  address1: z.string().max(255).optional().nullable(),
  address2: z.string().max(255).optional().nullable(),
  city: z.string().max(255).optional().nullable(),
  state: z.string().max(255).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  country: z.string().max(255).optional().nullable(),
  latitude: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),
});

export type OptionalAddress = z.infer<typeof optionalAddressSchema>;
