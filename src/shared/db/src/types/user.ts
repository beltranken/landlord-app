import { createSelectSchema } from "drizzle-orm/zod";
import { usersTable } from "../schema";
import { baseResponseSchema } from "./common";

export type User = typeof usersTable.$inferSelect;
export const userSchema = createSelectSchema(usersTable);
export const userResponseSchema = baseResponseSchema.extend({
  data: userSchema,
});
