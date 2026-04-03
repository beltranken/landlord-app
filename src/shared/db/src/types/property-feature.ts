import { createSelectSchema } from "drizzle-orm/zod";
import { propertyFeaturesTable } from "../schema";
import type { Nullable } from "./common";
import type { PropertypeFeatureType } from "./property-feature-type";
import { propertypeFeatureTypeSchema } from "./property-feature-type";

export type PropertyFeature = typeof propertyFeaturesTable.$inferSelect & {
  featureType?: Nullable<PropertypeFeatureType>;
};

export const propertyFeatureSchema = createSelectSchema(
  propertyFeaturesTable,
).extend({
  featureType: propertypeFeatureTypeSchema.optional().nullable(),
});
