import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { CreateTenant } from "@db/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createTenant } from "../services";

type CreateTenantRoute = {
  Body: CreateTenant;
  Reply: FormatResult<{ tenantId: number }>;
};

export function createTenantRoute(fastify: FastifyInstance) {
  return async function (
    request: FastifyRequest<CreateTenantRoute>,
    reply: FastifyReply<CreateTenantRoute>,
  ) {
    const createdTenant = await createTenant(fastify, {
      ...request.body,
      userId: request.user.userId,
      organizationId: request.user.organizationId,
    });

    reply.status(201).send(formatResult(createdTenant));
  };
}
