import { notDeleted } from "@backend/utils/softDelete";
import { WithOrganizationId } from "@db/types";
import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function getTenant(
  fastify: FastifyInstance,
  params: WithOrganizationId<{ tenantId: number }>,
) {
  fastify.log.debug(
    `Getting tenant with id: ${params.tenantId} for organizationId: ${params.organizationId}`,
  );

  const where = {
    ...notDeleted,
    organizationId: params.organizationId,
    id: params.tenantId,
  };

  const tenant = await fastify.db.query.tenantsTable.findFirst({
    where,
  });

  if (!tenant) {
    throw new NotFound("Tenant not found");
  }

  return tenant;
}
