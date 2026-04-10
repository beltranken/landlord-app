import { createSelectSchema } from "drizzle-orm/zod";
import z from "zod/v4";
import { rentsTable, rentTenantsTable } from "../schema";
import { Property, propertySchema } from "./property";
import { tenantSchema, type Tenant } from "./tenants";

export type RentTenant = typeof rentTenantsTable.$inferSelect & {
  tenant?: Tenant;
  rent?: Rent;
};

const rentTenantSchema = createSelectSchema(rentTenantsTable).extend({
  tenant: tenantSchema.optional(),
  property: propertySchema.optional(),
});

export type Rent = typeof rentsTable.$inferSelect & {
  rentTenants?: RentTenant[] | null;
  property?: Property | null;
};

export const rentSchema = createSelectSchema(rentsTable).extend({
  rentTenants: rentTenantSchema.array().optional(),
  property: propertySchema.optional(),
});

export const rentsFilterSchema = z.object({
  tenantId: z.coerce.number().int().optional(),
  propertyId: z.coerce.number().int().optional(),
});

export type RentsFilter = z.infer<typeof rentsFilterSchema>;
