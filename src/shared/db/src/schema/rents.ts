import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { RentFrequency, RentStatus } from "../types/enums";

import { timestamps } from "./common";
import { rentFrequencyEnum, rentStatusEnum } from "./enums";
import { propertiesTable } from "./properties";
import { tenantsTable } from "./tenants";
import { userAudit } from "./users";

export const rentsTable = pgTable("rents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  frequency: rentFrequencyEnum("frequency")
    .notNull()
    .default(RentFrequency.MONTHLY),
  amount: integer("amount"),
  gracePeriodDays: integer("grace_period_days"),
  nextBillingDate: date("next_billing_date"),
  status: rentStatusEnum("status").notNull().default(RentStatus.DRAFT),
  ...timestamps,
  ...userAudit,
});

export const rentTenantsTable = pgTable("rent_tenants", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  rentId: integer("rent_id")
    .notNull()
    .references(() => rentsTable.id, { onDelete: "cascade" }),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenantsTable.id, { onDelete: "cascade" }),
  isPrimary: boolean("is_primary").notNull().default(false),
  relationship: varchar("relationship", { length: 255 }),
});

export const rentChargesTable = pgTable("rent_charges", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  rentId: integer("rent_id")
    .notNull()
    .references(() => rentsTable.id, { onDelete: "cascade" }),
  isRecurring: boolean("is_recurring").notNull().default(false),
  amount: integer("amount").notNull(),
  description: text("description"),
  ...timestamps,
  ...userAudit,
});
