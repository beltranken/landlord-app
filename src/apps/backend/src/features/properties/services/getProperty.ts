import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notDeleted } from "@backend/utils/softDelete";
import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function getProperty(
  fastify: FastifyInstance,
  params: { organizationId: number; propertyId: number },
) {
  const { organizationId, propertyId } = params;
  fastify.log.info(`Getting properties for organizationId: ${organizationId}`);

  const where = {
    ...notDeleted,
    organizationId,
    id: propertyId,
  };

  const property = await fastify.db.query.propertiesTable.findFirst({
    where,
    with: {
      features: {
        with: {
          featureType: true,
        },
        where: {
          deletedAt: {
            isNull: true,
          },
        },
      },
    },
  });

  if (!property) {
    throw new NotFound("Property not found");
  }

  let image: string | null = null;
  if (property.image) {
    image = await getSignedUrl(
      fastify.s3,
      new GetObjectCommand({
        Bucket: fastify.config.S3_BUCKET_NAME,
        Key: property.image,
      }),
      {
        expiresIn: 60 * 60, // 1 hour
      },
    );
  }

  return { ...property, image };
}
