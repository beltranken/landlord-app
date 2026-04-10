import { createSelectSchema } from "drizzle-orm/zod";
import { createInsertSchema } from "drizzle-zod";
import z from "zod/v4";
import { tenantFilesTable, tenantsTable } from "../schema/tenants";

export type TenantFile = typeof tenantFilesTable.$inferSelect;
export const tenantFileSchema = createSelectSchema(tenantFilesTable);

export type Tenant = typeof tenantsTable.$inferSelect & {
  files?: TenantFile[];
};

export const tenantSchema = createSelectSchema(tenantsTable).extend({
  files: tenantFileSchema.array().optional(),
});

export const createTenantSchema = createInsertSchema(tenantsTable)
  .omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
  })
  .extend({
    rentTenants: z
      .array(
        z.object({
          rentId: z.number(),
        }),
      )
      .optional(),
  });

export type CreateTenant = z.infer<typeof createTenantSchema>;
