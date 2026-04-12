import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./common";
import { userAudit } from "./users";

export const filesTable = pgTable("files", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  size: integer("size").notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  ...timestamps,
  ...userAudit,
});
