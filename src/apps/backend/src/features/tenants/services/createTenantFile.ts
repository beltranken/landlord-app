import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notDeleted } from "@backend/utils/softDelete";
import { filesTable, tenantFilesTable } from "@db/schema";
import { CreateTenantFile, WithUserIdAndOrganizationId } from "@db/types";
import { FastifyInstance } from "fastify";
import { BadRequest, NotFound } from "http-errors";

export async function createTenantFile(
  fastify: FastifyInstance,
  {
    organizationId,
    userId,
    tenantId,
    image,
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

  if (!image) {
    throw new BadRequest(
      "Image information is required to create a tenant file",
    );
  }

  const key = `tenants/${tenantId}/files/${Date.now()}-${image.name}`;

  const signUrl = await getSignedUrl(
    fastify.s3,
    new PutObjectCommand({
      Bucket: fastify.config.S3_BUCKET_NAME,
      Key: key,
      ContentType: image.type,
      ContentLength: image.size,
    }),
    {
      expiresIn: 60 * 60 * 3, // 3 hours
    },
  );

  const [createdFile] = await fastify.db
    .insert(filesTable)
    .values({
      name: image.name,
      key,
      size: image.size,
      contentType: image.type,
      isCompleted: false,
      createdBy: userId,
      updatedBy: userId,
    })
    .returning({ id: filesTable.id });

  const [file] = await fastify.db
    .insert(tenantFilesTable)
    .values({
      tenantId,
      fileId: createdFile.id,
      name: fileData.name,
      description: fileData.description,
      url: key,
      image: image.name,
      createdBy: userId,
      updatedBy: userId,
    })
    .returning({ id: tenantFilesTable.id });

  return { tenantFileId: file.id, signUrl };
}
