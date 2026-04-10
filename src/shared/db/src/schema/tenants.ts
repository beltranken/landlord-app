import { date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { address, timestamps } from "./common";
import { organizationsTable, userAudit, usersTable } from "./users";

export const tenantsTable = pgTable("tenants", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: integer("organization_id")
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: date("date_of_birth"),
  ...address,

  userId: integer("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  ...timestamps,
  ...userAudit,
});

export const tenantFilesTable = pgTable("tenant_files", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenantsTable.id, { onDelete: "cascade" }),
  image: varchar("image", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  description: text("description"),
  ...timestamps,
  ...userAudit,
});

export const tenantReferencesTable = pgTable("tenant_references", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenantsTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  ...timestamps,
  ...userAudit,
});
