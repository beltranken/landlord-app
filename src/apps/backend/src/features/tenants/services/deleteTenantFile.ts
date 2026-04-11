import { eq } from "@db/drizzle";
import { tenantFilesTable } from "@db/schema";
import { WithUserIdAndOrganizationId } from "@db/types";
import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function deleteTenantFile(
  fastify: FastifyInstance,
  {
    organizationId,
    userId,
    tenantId,
    tenantFileId,
  }: WithUserIdAndOrganizationId<{
    tenantId: number;
    tenantFileId: number;
  }>,
) {
  fastify.log.debug(
    `Deleting tenant file ${tenantFileId} for organizationId: ${organizationId}`,
  );

  const file = await fastify.db.query.tenantFilesTable.findFirst({
    where: {
      id: tenantFileId,
      tenantId,
      deletedAt: {
        isNull: true,
      },
    },
    with: {
      tenant: true,
    },
  });

  if (
    !file ||
    !file.tenant ||
    file.tenant.organizationId !== organizationId ||
    file.tenant.deletedAt !== null
  ) {
    throw new NotFound("Tenant file not found");
  }

  await fastify.db
    .update(tenantFilesTable)
    .set({
      deletedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(tenantFilesTable.id, tenantFileId));

  return { tenantFileId };
}
