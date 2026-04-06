import formatResultWithPaging, {
  FormatResultWithPaging,
} from "@backend/utils/formatResultWithPaging";
import { Tenant } from "@db/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTenants } from "../services";

type GetTenantsRoute = {
  Reply: FormatResultWithPaging<Tenant>;
};

export function getTenantsRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<GetTenantsRoute>,
    reply: FastifyReply<GetTenantsRoute>,
  ) => {
    const { tenants, total, page, pageSize } = await getTenants(fastify, {
      organizationId: req.user.organizationId,
    });

    reply
      .status(200)
      .send(formatResultWithPaging(tenants, total, page, pageSize));
  };
}
