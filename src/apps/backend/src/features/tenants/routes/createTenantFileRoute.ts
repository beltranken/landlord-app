import formatResult from "@backend/utils/formatResult";
import { CreateTenantFile, CreateTenantFileResponse } from "@db/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createTenantFile } from "../services";

type CreateTenantFileRoute = {
  Params: {
    tenantId: number;
  };
  Body: Omit<CreateTenantFile, "tenantId">;
  Reply: CreateTenantFileResponse;
};

export function createTenantFileRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<CreateTenantFileRoute>,
    reply: FastifyReply<CreateTenantFileRoute>,
  ) => {
    const { tenantId } = req.params;
    const result = await createTenantFile(fastify, {
      ...req.body,
      tenantId,
      organizationId: req.user.organizationId,
      userId: req.user.userId,
    });

    reply.status(201).send(formatResult(result));
  };
}
