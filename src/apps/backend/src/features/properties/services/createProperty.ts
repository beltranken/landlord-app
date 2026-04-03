import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "@db/drizzle";
import { propertiesTable } from "@db/schema";
import { CreateProperty, PropertyStatus } from "@db/types";
import { FastifyInstance } from "fastify";
import mime from "mime/lite";

export async function createProperty(
  fastify: FastifyInstance,
  {
    userId,
    organizationId,
    image,
    ...data
  }: CreateProperty & { userId: number; organizationId: number },
) {
  fastify.log.debug(
    `Creating property for user ${userId} in organization ${organizationId} with data: ${JSON.stringify(data)}`,
  );
  fastify.log.debug(`Image info: ${JSON.stringify(image)}`);

  const [property] = await fastify.db
    .insert(propertiesTable)
    .values({
      ...data,
      status: PropertyStatus.UNAVAILABLE,
      createdBy: userId,
      updatedBy: userId,
      organizationId,
    })
    .returning({ id: propertiesTable.id });

  let _image: string | undefined;
  if (image) {
    const contentType = mime.getType(image.name);

    const key = `properties/${property.id}/main-photo`;

    _image = await getSignedUrl(
      fastify.s3,
      new PutObjectCommand({
        Bucket: fastify.config.S3_BUCKET_NAME,
        Key: key,
        ContentType: contentType ?? undefined,
        ContentLength: image.size,
      }),
      {
        expiresIn: 60 * 60 * 3, // 3 hours
      },
    );

    await fastify.db
      .update(propertiesTable)
      .set({ image: key })
      .where(eq(propertiesTable.id, property.id));
  }

  return {
    id: property.id,
    imageUri: _image,
  };
}
