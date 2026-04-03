import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import { UserRole, UserStatus } from "../types/enums";

import { address, timestamps } from "./common";
import { userRoleEnum, userStatusEnum } from "./enums";

export const organizationsTable = pgTable("organizations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  taxId: varchar("tax_id", { length: 50 }),
  ...address,
  ...timestamps,
});

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }),
  image: varchar("image", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: timestamp("date_of_birth"),
  status: userStatusEnum("status").default(UserStatus.INACTIVE).notNull(),
  ...address,
  ...timestamps,
});

export const organizationUsersTable = pgTable(
  "organization_users",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").default(UserRole.USER).notNull(),
    isDisabled: boolean("is_disabled").default(false).notNull(),
    currency: varchar("currency", { length: 10 }).default("php").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("org_user_unique_idx").on(table.organizationId, table.userId),
  ],
);

export const userAudit = {
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
  updatedBy: integer("updated_by")
    .references(() => usersTable.id)
    .notNull(),
};
