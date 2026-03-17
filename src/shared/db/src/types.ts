import { organizationsTable, usersTable } from "./schema";

export type User = typeof usersTable.$inferSelect;

export type Organization = typeof organizationsTable.$inferSelect;
