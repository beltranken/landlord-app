import formatResultWithPaging, {
  FormatResultWithPaging,
} from "@backend/utils/formatResultWithPaging";
import { Property } from "@db/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getProperties } from "../services";

type GetPropertiesRoute = {
  Reply: FormatResultWithPaging<Property>;
};

export function getPropertiesRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<GetPropertiesRoute>,
    reply: FastifyReply<GetPropertiesRoute>,
  ) => {
    const { properties, total, page, pageSize } = await getProperties(fastify, {
      organizationId: req.user.organizationId,
    });
    reply
      .status(200)
      .send(formatResultWithPaging(properties, total, page, pageSize));
  };
}
