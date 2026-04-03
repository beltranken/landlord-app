import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { BadRequest } from "http-errors";

const s3PluginImpl = async (fastify: FastifyInstance) => {
  fastify.log.info("Registering S3 plugin");

  const s3 = new S3Client({
    region: fastify.config.AWS_REGION,
    endpoint: fastify.config.S3_ENDPOINT,
    credentials: {
      accessKeyId: fastify.config.AWS_ACCESS_KEY_ID,
      secretAccessKey: fastify.config.AWS_SECRET_ACCESS_KEY,
    },
  });

  fastify.decorate("s3", s3);

  fastify.get("/health/s3", async () => {
    try {
      await fastify.s3.send(
        new HeadBucketCommand({ Bucket: fastify.config.S3_BUCKET_NAME }),
      );
      return { ok: true };
    } catch (err) {
      fastify.log.error({ err }, "S3 health check failed");
      throw new BadRequest("S3 not reachable");
    }
  });
};

export const s3Plugin = fp(s3PluginImpl, {
  name: "s3",
});
