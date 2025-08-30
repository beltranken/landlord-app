import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const propertyTypes = pgTable("property_types", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  addressLine1: varchar("address_line1", { length: 256 }),
  addressLine2: varchar("address_line2", { length: 256 }),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 128 }),
  postalCode: varchar("postal_code", { length: 32 }),
  country: varchar("country", { length: 128 }).notNull(),
  typeId: integer("type_id")
    .notNull()
    .references(() => propertyTypes.id, { onDelete: "restrict" }),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dataType = pgEnum("data_type", [
  "number",
  "text",
  "boolean",
  "date",
]);

export const propertyMetaTypes = pgTable("property_meta_types", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 200 }).notNull(),
  dataType: varchar("data_type", { length: 50 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const propertyMetaValues = pgTable("property_meta_values", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  propertyId: integer("property_id")
    .references(() => properties.id)
    .notNull(),
  metaTypeId: integer("meta_type_id")
    .references(() => propertyMetaTypes.id)
    .notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const propertyRelations = relations(properties, ({ one, many }) => ({
  type: one(propertyTypes, {
    fields: [properties.typeId],
    references: [propertyTypes.id],
  }),
  metaValues: many(propertyMetaValues),
}));

export const propertyMetaRelations = relations(
  propertyMetaValues,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertyMetaValues.propertyId],
      references: [properties.id],
    }),
    metaType: one(propertyMetaTypes, {
      fields: [propertyMetaValues.metaTypeId],
      references: [propertyMetaTypes.id],
    }),
  })
);
