import { date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./common";
import { invoiceReasonEnum, paymentModeEnum, paymentStatusEnum } from "./enums";
import { rentsTable } from "./rents";
import { userAudit } from "./users";

export const invoicesTable = pgTable("invoices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  rentId: integer("rent_id")
    .notNull()
    .references(() => rentsTable.id, { onDelete: "cascade" }),
  invoiceReason: invoiceReasonEnum("invoice_reason").notNull(),
  description: text("description"),
  period: integer("period").notNull(),
  amount: integer("amount").notNull(),
  dueDate: date("due_date").notNull(),
  ...timestamps,
  ...userAudit,
});

export const invoiceAttachments = pgTable("invoice_attachments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoicesTable.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 255 }).notNull(),
  description: text("description"),
  ...timestamps,
  ...userAudit,
});

export const invoiceItemsTable = pgTable("invoice_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoicesTable.id, { onDelete: "cascade" }),
  description: text("description"),
  amount: integer("amount").notNull(),
  ...timestamps,
  ...userAudit,
});

export const paymentsTable = pgTable("payments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  amount: integer("amount").notNull(),
  date: date("date").notNull(),
  confirmedDate: date("confirmed_date"),
  cancelledDate: date("cancelled_date"),
  mode: paymentModeEnum("mode").notNull(),
  status: paymentStatusEnum("status").notNull(),
  referenceNumber: varchar("reference_number", { length: 255 }),
  rentId: integer("rent_id")
    .notNull()
    .references(() => rentsTable.id, { onDelete: "cascade" }),
  ...timestamps,
  ...userAudit,
});

export const paymentAttachmentsTable = pgTable("payment_attachments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  paymentId: integer("payment_id")
    .notNull()
    .references(() => paymentsTable.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 255 }).notNull(),
  description: text("description"),
  ...timestamps,
  ...userAudit,
});
