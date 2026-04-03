import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import z from "zod/v4";
import { propertiesTable } from "../schema";
import type { Nullable } from "./common";
import {
  baseResponseSchema,
  baseResponseWithPagingSchema,
  imageUploadRequestSchema,
} from "./common";
import type { PropertyFeature } from "./property-feature";
import { propertyFeatureSchema } from "./property-feature";

export type Property = typeof propertiesTable.$inferSelect & {
  features?: Nullable<PropertyFeature[]>;
};

export const propertySchema = createSelectSchema(propertiesTable, {
  image: z.string().optional().nullable(),
});

export const propertiesResponseSchema = baseResponseWithPagingSchema.extend({
  data: z.array(
    propertySchema.extend({
      features: z.array(propertyFeatureSchema).optional().nullable(),
      image: z.string().optional().nullable(),
    }),
  ),
});

export const createPropertySchema = createInsertSchema(propertiesTable, {
  name: (schema) => schema.min(1, "Property name is required"),
  image: imageUploadRequestSchema.optional(),
}).pick({
  image: true,
  name: true,
  description: true,
  type: true,
  defaultRentAmount: true,
  defaultRentFrequency: true,
  parentId: true,
  address1: true,
  address2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
});

export type CreateProperty = z.infer<typeof createPropertySchema>;
export const createPropertyResponseSchema = baseResponseSchema.extend({
  data: z.object({
    id: z.number(),
    imageUri: z.string().optional().nullable(),
  }),
});
export type CreatePropertyResponse = z.infer<
  typeof createPropertyResponseSchema
>;

export const getPropertyParamsSchema = z.object({
  propertyId: z.coerce.number().int(),
});
export const getPropertyResponseSchema = baseResponseSchema.extend({
  data: propertySchema,
});
