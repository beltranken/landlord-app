import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import z from "zod/v4";
import { rentChargesTable, rentsTable, rentTenantsTable } from "../schema";
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

export const createRentTenantSchema = createInsertSchema(rentTenantsTable).omit(
  {
    rentId: true,
  },
);

export const createRentSchema = createInsertSchema(rentsTable)
  .omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    createdBy: true,
    updatedBy: true,
    status: true,
  })
  .extend({
    tenants: createRentTenantSchema
      .array()
      .min(1, "At least one tenant is required"),
  });

export type CreateRent = z.infer<typeof createRentSchema>;

export const createRentStep1Schema = createRentSchema.pick({
  propertyId: true,
});

export type CreateRentStep1 = z.infer<typeof createRentStep1Schema>;

export const createRentStep2Schema = z
  .object({
    tenants: createRentTenantSchema
      .array()
      .min(1, "At least one tenant is required"),
  })
  .refine((data) => data.tenants.filter((t) => t.isPrimary).length === 1, {
    message: "Exactly one tenant must be marked as primary",
    path: ["tenants"],
  });

export type CreateRentStep2 = z.infer<typeof createRentStep2Schema>;

export type RentCharge = typeof rentChargesTable.$inferSelect;
export const createRentChargeSchema = createSelectSchema(rentChargesTable).pick(
  {
    frequency: true,
    amount: true,
    description: true,
    billingCycleAnchor: true,
  },
);
export type CreateRentCharge = z.infer<typeof createRentChargeSchema>;

export const createRentStep3Schema = createRentSchema
  .pick({
    startDate: true,
    endDate: true,
    amount: true,
    frequency: true,
    billingCycleAnchor: true,
    firstBillingDate: true,
    autoRenew: true,
  })
  .extend({
    charges: createRentChargeSchema.array(),
  });
export type CreateRentStep3 = z.infer<typeof createRentStep3Schema>;

export const createRentStepSchema = z.object({
  step1: createRentStep1Schema,
  step2: createRentStep2Schema,
  step3: createRentStep3Schema,
});

export type CreateRentStep = z.infer<typeof createRentStepSchema>;
