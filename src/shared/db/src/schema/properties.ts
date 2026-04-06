import {
  foreignKey,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { PropertyFeatureTypes, RentFrequency } from "../types/enums";

import { address, timestamps } from "./common";
import {
  propertyFeatureTypeEnum,
  propertyStatusEnum,
  propertyTypeEnum,
  rentFrequencyEnum,
} from "./enums";
import { organizationsTable, userAudit } from "./users";

export const propertiesTable = pgTable(
  "properties",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),
    status: propertyStatusEnum("status").notNull(),
    image: varchar("image", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    type: propertyTypeEnum("type").notNull(),
    parentId: integer("parent_id"),
    defaultRentFrequency: rentFrequencyEnum("default_rent_frequency")
      .notNull()
      .default(RentFrequency.MONTHLY),
    defaultRentAmount: integer("default_rent_amount").notNull(),

    ...address,
    ...timestamps,
    ...userAudit,
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "properties_parent_id",
    }),
  ],
);

export const propertyAttachmentsTable = pgTable("property_attachments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  description: text("description"),
  ...timestamps,
  ...userAudit,
});

export const propertyFeatureTypesTable = pgTable("property_feature_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  type: propertyFeatureTypeEnum("type")
    .notNull()
    .default(PropertyFeatureTypes.TEXT),
  options: text("options"),
  unit: varchar("unit", { length: 50 }),
  icon: varchar("icon", { length: 100 }),
  ...timestamps,
});

export const propertyFeaturesTable = pgTable("property_features", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  propertyFeatureTypeId: integer("property_feature_type_id")
    .notNull()
    .references(() => propertyFeatureTypesTable.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }),
  value: text("value"),
  ...timestamps,
  ...userAudit,
});

export const propertyImagesTable = pgTable("property_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  propertyFeatureId: integer("property_feature_id").references(
    () => propertyFeaturesTable.id,
    { onDelete: "cascade" },
  ),
  url: varchar("url", { length: 255 }).notNull(),
  description: text("description"),
  ...timestamps,
  ...userAudit,
});
