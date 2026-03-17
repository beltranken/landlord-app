import { FastifyInstance, FastifyReply } from "fastify";
import ms, { StringValue } from "ms";

export async function processAccessAuth(
  fastify: FastifyInstance,
  reply: FastifyReply,
  userId: number,
) {
  const jwtAccessExpiryMs = ms(
    (fastify.config.JWT_ACCESS_EXPIRY ?? "1h") as StringValue,
  );
  const token = await reply.jwtSign(
    { userId },
    {
      expiresIn: jwtAccessExpiryMs / 1000,
    },
  );

  return {
    token,
    jwtAccessExpiry: jwtAccessExpiryMs,
  };
}
export async function processRefreshAuth(
  fastify: FastifyInstance,
  reply: FastifyReply,
  userId: number,
  organizationId: number,
) {
  const jwtRefreshExpiryMs = ms(
    (fastify.config.JWT_REFRESH_EXPIRY ?? "7d") as StringValue,
  );

  const refreshToken = await reply.refreshJwtSign(
    { userId, organizationId },
    {
      expiresIn: jwtRefreshExpiryMs / 1000,
    },
  );

  return {
    refreshToken,
    jwtRefreshExpiry: jwtRefreshExpiryMs,
  };
}

export async function processAuth({
  fastify,
  userId,
  organizationId,
  reply,
}: Readonly<{
  fastify: FastifyInstance;
  userId: number;
  organizationId: number;
  reply: FastifyReply;
}>) {
  return await Promise.all([
    processAccessAuth(fastify, reply, userId),
    processRefreshAuth(fastify, reply, userId, organizationId),
  ]).then(([accessAuth, refreshAuth]) => ({
    ...accessAuth,
    ...refreshAuth,
  }));
}
