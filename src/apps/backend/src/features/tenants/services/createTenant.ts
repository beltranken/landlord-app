import { tenantsTable } from "@db/schema";
import { CreateTenant, WithUserIdAndOrganizationId } from "@db/types";
import { FastifyInstance } from "fastify";

export async function createTenant(
  fastify: FastifyInstance,
  {
    organizationId,
    userId,
    ...tenantData
  }: WithUserIdAndOrganizationId<CreateTenant>,
) {
  fastify.log.debug(
    `Creating tenant with data: ${JSON.stringify(tenantData)} for organizationId: ${organizationId}`,
  );

  const [tenant] = await fastify.db
    .insert(tenantsTable)
    .values({
      ...tenantData,
      organizationId,
      createdBy: userId,
      updatedBy: userId,
    })
    .returning({ id: tenantsTable.id });

  return {
    tenantId: tenant.id,
  };
}
