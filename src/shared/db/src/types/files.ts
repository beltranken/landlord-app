import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { filesTable } from "../schema";

export type File = typeof filesTable.$inferSelect;

export const fileSchema = createSelectSchema(filesTable);
export const createFileSchema = createInsertSchema(filesTable).omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true,
  isCompleted: true,
  key: true,
});
