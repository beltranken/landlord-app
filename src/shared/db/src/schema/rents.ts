import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { ChargeFrequency, RentFrequency, RentStatus } from "../types/enums";

import { timestamps } from "./common";
import {
  chargeFrequencyEnum,
  rentFrequencyEnum,
  rentStatusEnum,
} from "./enums";
import { propertiesTable } from "./properties";
import { tenantsTable } from "./tenants";
import { userAudit } from "./users";

export const rentsTable = pgTable("rents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  frequency: rentFrequencyEnum("frequency")
    .notNull()
    .default(RentFrequency.MONTHLY),
  amount: integer("amount"),
  gracePeriodDays: integer("grace_period_days"),
  firstBillingDate: timestamp("billing_start_date").defaultNow(),
  billingCycleAnchor: integer("billing_cycle_anchor").default(1),
  autoRenew: boolean("auto_renew").notNull().default(false),
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
  frequency: chargeFrequencyEnum("frequency")
    .notNull()
    .default(ChargeFrequency.ONE_TIME),
  billingCycleAnchor: integer("billing_cycle_anchor").default(1),
  amount: integer("amount").notNull(),
  description: text("description"),
  ...timestamps,
  ...userAudit,
});
