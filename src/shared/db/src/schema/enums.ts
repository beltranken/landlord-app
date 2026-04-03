import { pgEnum } from "drizzle-orm/pg-core";

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
} from "../types/enums";

function enumToPgEnum<T extends Record<string, string>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum) as [T[keyof T], ...T[keyof T][]];
}

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
