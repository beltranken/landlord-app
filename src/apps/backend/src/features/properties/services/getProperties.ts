import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notDeleted } from "@backend/utils/softDelete";
import { count, sql } from "@db/drizzle";
import { PagingRequest, PropertyStatus } from "@types";
import { FastifyInstance } from "fastify";

type GetPropertiesParam = {
  organizationId: number;
  filter?: {
    statuses?: PropertyStatus[];
  };
} & Partial<PagingRequest>;

export async function getProperties(
  fastify: FastifyInstance,
  { organizationId, filter = {}, page = 1, pageSize = 50 }: GetPropertiesParam,
) {
  fastify.log.debug(
    `Getting properties with filter: ${JSON.stringify(filter)}, page: ${page}, pageSize: ${pageSize}`,
  );

  // TODO: apply filters

  const where = {
    ...notDeleted,
    organizationId,
  };

  const countQuery = fastify.db.query.propertiesTable.findMany({
    columns: {
      id: true,
    },
    where,
  });

  const [properties, [{ total }]] = await Promise.all([
    fastify.db.query.propertiesTable.findMany({
      limit: pageSize,
      offset: (page - 1) * pageSize,
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
    }),
    fastify.db.select({ total: count() }).from(sql`${countQuery}`),
  ]);

  const promises = properties.map(async (property) => {
    if (property.image) {
      const imageUri = await getSignedUrl(
        fastify.s3,
        new GetObjectCommand({
          Bucket: fastify.config.S3_BUCKET_NAME,
          Key: property.image,
        }),
        {
          expiresIn: 60 * 60, // 1 hour
        },
      );

      return {
        ...property,
        image: imageUri,
      };
    }

    return property;
  });

  return {
    total,
    properties: await Promise.all(promises),
    page,
    pageSize,
  };
}
