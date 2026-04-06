import { createSelectSchema } from "drizzle-orm/zod";
import { createInsertSchema } from "drizzle-zod";
import z from "zod/v4";
import { tenantsTable } from "../schema/tenants";

export type Tenant = typeof tenantsTable.$inferSelect;

export const tenantSchema = createSelectSchema(tenantsTable);

export const createTenantSchema = createInsertSchema(tenantsTable).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export type CreateTenant = z.infer<typeof createTenantSchema>;
