export enum PropertyFeatureTypes {
  NUMBER = "number",
  TEXT = "text",
  BOOLEAN = "boolean",
  OPTION = "option",
}

export enum InvoiceReason {
  RENT = "rent",
  DEPOSIT = "deposit",
  UTILITY = "utility",
  MAINTENANCE = "maintenance",
  LATE_FEE = "late_fee",
  DAMAGE = "damage",
  ADJUSTMENT = "adjustment",
  CREDIT = "credit",
  OTHERS = "others",
}

export enum PaymentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum RentFrequency {
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum PropertyType {
  COMPLEX = "complex",
  CONDO = "condo",
  APARTMENT = "apartment",
  ROOM = "room",
}

export enum PropertyStatus {
  AVAILABLE = "available",
  UNDER_MAINTENANCE = "under_maintenance",
  UNAVAILABLE = "unavailable",
  RENTED = "rented",
}

export enum RentStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  EXPIRED = "expired",
  TERMINATED = "terminated",
}

export enum PaymentMode {
  CASH = "cash",
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
  CHECK = "check",
  E_WALLET = "e_wallet",
  OTHER = "other",
}

export enum UserRole {
  ADMIN = "owner",
  USER = "tenant",
  COLLECTOR = "collector",
}
