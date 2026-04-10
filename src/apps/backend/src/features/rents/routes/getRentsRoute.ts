import formatResultWithPaging, {
  FormatResultWithPaging,
} from "@backend/utils/formatResultWithPaging";
import type { BaseRequestWithPaging, Rent, RentsFilter } from "@db/types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getRents } from "../services/index";

type GetRentsRoute = {
  Querystring: BaseRequestWithPaging & RentsFilter;
  Reply: FormatResultWithPaging<Rent>;
};

export function getRentsRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<GetRentsRoute>,
    reply: FastifyReply<GetRentsRoute>,
  ) => {
    const {
      tenantId,
      propertyId,
      page: requestPage,
      pageSize: requestPageSize,
    } = req.query;
    const { rents, total, page, pageSize } = await getRents(fastify, {
      organizationId: req.user.organizationId,
      tenantId,
      propertyId,
      page: requestPage,
      pageSize: requestPageSize,
    });

    fastify.log.debug(`rents result: ${JSON.stringify(rents, null, 2)}`);

    reply
      .status(200)
      .send(formatResultWithPaging(rents, total, page, pageSize));
  };
}
