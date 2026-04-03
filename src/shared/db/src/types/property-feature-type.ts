import { createSelectSchema } from "drizzle-orm/zod";
import { propertyFeatureTypesTable } from "../schema";

export type PropertypeFeatureType =
  typeof propertyFeatureTypesTable.$inferSelect;
export const propertypeFeatureTypeSchema = createSelectSchema(
  propertyFeatureTypesTable,
);
