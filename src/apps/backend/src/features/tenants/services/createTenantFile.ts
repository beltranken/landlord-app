import { notDeleted } from "@backend/utils/softDelete";
import { tenantFilesTable } from "@db/schema";
import { CreateTenantFile, WithUserIdAndOrganizationId } from "@db/types";
import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function createTenantFile(
  fastify: FastifyInstance,
  {
    organizationId,
    userId,
    tenantId,
    ...fileData
  }: WithUserIdAndOrganizationId<CreateTenantFile>,
) {
  fastify.log.debug(
    `Creating tenant file for tenantId: ${tenantId} in organizationId: ${organizationId}`,
  );

  const tenant = await fastify.db.query.tenantsTable.findFirst({
    where: {
      ...notDeleted,
      organizationId,
      id: tenantId,
    },
  });

  if (!tenant) {
    throw new NotFound("Tenant not found");
  }

  const [file] = await fastify.db
    .insert(tenantFilesTable)
    .values({
      tenantId,
      ...fileData,
      createdBy: userId,
      updatedBy: userId,
    })
    .returning({ id: tenantFilesTable.id });

  return { tenantFileId: file.id };
}
