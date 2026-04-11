import { UserRole } from "@db/types";
import { FastifyInstance, FastifyReply } from "fastify";
import ms, { StringValue } from "ms";

type ProcessAuthInput = {
  fastify: FastifyInstance;
  userId: number;
  role: UserRole;
  organizationId: number;
  reply: FastifyReply;
};

export async function processAccessAuth({
  fastify,
  reply,
  userId,
  role,
  organizationId,
}: ProcessAuthInput) {
  // TODO: add permissions/roles here

  const jwtAccessExpiryMs = ms(
    (fastify.config.JWT_ACCESS_EXPIRY ?? "1h") as StringValue,
  );
  const token = await reply.jwtSign(
    { userId, organizationId },
    {
      expiresIn: jwtAccessExpiryMs / 1000,
    },
  );

  return {
    token,
    jwtAccessExpiry: jwtAccessExpiryMs,
  };
}
export async function processRefreshAuth({
  fastify,
  reply,
  userId,
  organizationId,
}: Omit<ProcessAuthInput, "role">) {
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
  role,
  organizationId,
  reply,
}: Readonly<ProcessAuthInput>) {
  return await Promise.all([
    processAccessAuth({ fastify, reply, userId, role, organizationId }),
    processRefreshAuth({ fastify, reply, userId, organizationId }),
  ]).then(([accessAuth, refreshAuth]) => ({
    ...accessAuth,
    ...refreshAuth,
  }));
}
