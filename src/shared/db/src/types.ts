import { baseResponseSchema, baseResponseWithPagingSchema } from "@types";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { organizationsTable, propertiesTable, usersTable } from "./schema";

export type User = typeof usersTable.$inferSelect;
export const userSchema = createSelectSchema(usersTable);
export const userResponseSchema = baseResponseSchema.extend({
  data: userSchema,
});

export type Organization = typeof organizationsTable.$inferSelect;
export const organizationSchema = createSelectSchema(organizationsTable);

export type Property = typeof propertiesTable.$inferSelect;
export const propertySchema = createSelectSchema(propertiesTable);
export const propertiesResponseSchema = baseResponseWithPagingSchema.extend({
  data: z.array(propertySchema),
});
