import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { deleteTenantFile } from "../services";

type DeleteTenantFileRoute = {
  Params: {
    tenantId: number;
    tenantFileId: number;
  };
  Reply: FormatResult<{ tenantFileId: number }>;
};

export function deleteTenantFileRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<DeleteTenantFileRoute>,
    reply: FastifyReply<DeleteTenantFileRoute>,
  ) => {
    const { tenantId, tenantFileId } = req.params;

    const result = await deleteTenantFile(fastify, {
      tenantId,
      tenantFileId,
      organizationId: req.user.organizationId,
      userId: req.user.userId,
    });

    reply.status(200).send(formatResult(result));
  };
}
