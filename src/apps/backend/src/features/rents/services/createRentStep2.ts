import { notDeleted } from "@backend/utils/softDelete";
import { eq } from "@db/drizzle";
import { rentTenantsTable } from "@db/schema";
import type { CreateRentStep2, WithUserIdAndOrganizationId } from "@db/types";
import { RentStatus } from "@db/types";
import type { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function createRentStep2(
  fastify: FastifyInstance,
  {
    organizationId,
    userId,
    ...stepData
  }: WithUserIdAndOrganizationId<CreateRentStep2>,
) {
  const { rentId, tenants } = stepData;

  // 1. Check if the rent exists, is a draft, and belongs to the organization
  const rent = await fastify.db.query.rentsTable.findFirst({
    where: {
      ...notDeleted,
      id: rentId,
      status: RentStatus.DRAFT,
    },
    with: {
      property: true,
    },
  });

  if (!rent || rent.property?.organizationId !== organizationId) {
    throw new NotFound("Draft rent not found");
  }

  // 2. Validate that all tenants exist and belong to the organization
  for (const tenant of tenants) {
    const existingTenant = await fastify.db.query.tenantsTable.findFirst({
      where: {
        ...notDeleted,
        id: tenant.tenantId,
        organizationId,
      },
    });

    if (!existingTenant) {
      throw new NotFound(`Tenant with id ${tenant.tenantId} not found`);
    }
  }

  // 3. Remove existing tenants for this rent (in case of re-doing step 2)
  await fastify.db
    .delete(rentTenantsTable)
    .where(eq(rentTenantsTable.rentId, rentId));

  // 4. Insert the tenants
  await fastify.db.insert(rentTenantsTable).values(
    tenants.map((tenant) => ({
      ...tenant,
      rentId,
    })),
  );

  return {
    rentId,
  };
}
