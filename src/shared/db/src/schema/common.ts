import { text, timestamp, varchar } from "drizzle-orm/pg-core";

export const address = {
  address1: varchar("address1", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 255 }),
  latitude: text("latitude"),
  longitude: text("longitude"),
};

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at"),
};
