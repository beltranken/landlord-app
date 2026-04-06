import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { Tenant } from "@db/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTenant } from "../services";

type GetTenantRoute = {
  Reply: FormatResult<Tenant>;
  Params: {
    tenantId: number;
  };
};

export function getTenantRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<GetTenantRoute>,
    reply: FastifyReply<GetTenantRoute>,
  ) => {
    const { tenantId } = req.params;
    const tenant = await getTenant(fastify, {
      organizationId: req.user.organizationId,
      tenantId,
    });
    reply.status(200).send(formatResult(tenant));
  };
}
