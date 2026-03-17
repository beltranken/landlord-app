import {
  boolean,
  date,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import {
  InvoiceReason,
  PaymentMode,
  PaymentStatus,
  PropertyFeatureTypes,
  PropertyStatus,
  PropertyType,
  RentFrequency,
  RentStatus,
  UserRole,
  UserStatus,
} from "@enums";

function enumToPgEnum<T extends Record<string, string>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum) as [T[keyof T], ...T[keyof T][]];
}

const address = {
  address1: varchar("address1", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 255 }),
  latitude: text("latitude"),
  longitude: text("longitude"),
};

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
};

const userAudit = {
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
  updatedBy: integer("updated_by")
    .references(() => usersTable.id)
    .notNull(),
};

export const userStatusEnum = pgEnum("user_status", enumToPgEnum(UserStatus));

export const userRoleEnum = pgEnum("user_role", enumToPgEnum(UserRole));

export const rentFrequencyEnum = pgEnum(
  "rent_frequency",
  enumToPgEnum(RentFrequency),
);

export const propertyTypeEnum = pgEnum(
  "property_type",
  enumToPgEnum(PropertyType),
);

export const propertyStatusEnum = pgEnum(
  "property_status",
  enumToPgEnum(PropertyStatus),
);
export const propertyFeatureTypeEnum = pgEnum(
  "property_feature_type",
  enumToPgEnum(PropertyFeatureTypes),
);
export const invoiceReasonEnum = pgEnum(
  "invoice_reason",
  enumToPgEnum(InvoiceReason),
);

export const paymentStatusEnum = pgEnum(
  "payment_status",
  enumToPgEnum(PaymentStatus),
);

export const rentStatusEnum = pgEnum("rent_status", enumToPgEnum(RentStatus));

export const paymentModeEnum = pgEnum(
  "payment_mode",
  enumToPgEnum(PaymentMode),
);

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
    ...timestamps,
  },
  (table) => [
    uniqueIndex("org_user_unique_idx").on(table.organizationId, table.userId),
  ],
);

export const propertiesTable = pgTable(
  "properties",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),
    propertyStatus: propertyStatusEnum("property_status").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
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

export const propertyFeatureTypesTable = pgTable("property_feature_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  type: propertyFeatureTypeEnum("type")
    .notNull()
    .default(PropertyFeatureTypes.TEXT),
  options: text("options"),
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
  name: varchar("name", { length: 255 }).notNull(),
  value: text("value"),
  ...timestamps,
  ...userAudit,
});

export const tenantsTable = pgTable(
  "tenants",
  {
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
    addressSameAsParent: boolean("address_same_as_parent")
      .default(false)
      .notNull(),
    relationship: varchar("relationship", { length: 255 }),
    parentId: integer("parent_id"),
    userId: integer("user_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    ...timestamps,
    ...userAudit,
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "tenants_parent_id",
    }),
  ],
);

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

export const rentsTable = pgTable("rents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "cascade" }),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenantsTable.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  frequency: rentFrequencyEnum("frequency")
    .notNull()
    .default(RentFrequency.MONTHLY),
  amount: integer("amount").notNull(),
  gracePeriodDays: integer("grace_period_days").notNull(),
  nextBillingDate: date("next_billing_date").notNull(),
  status: rentStatusEnum("status").notNull().default(RentStatus.DRAFT),
  ...timestamps,
  ...userAudit,
});

export const rentChargesTable = pgTable("rent_changes", {
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
