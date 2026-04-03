import { createSelectSchema } from "drizzle-orm/zod";
import { organizationsTable } from "../schema";

export type Organization = typeof organizationsTable.$inferSelect;
export const organizationSchema = createSelectSchema(organizationsTable);
