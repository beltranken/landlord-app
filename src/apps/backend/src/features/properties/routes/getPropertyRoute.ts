import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { Property } from "@db/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getProperty } from "../services";

type GetPropertiesRoute = {
  Reply: FormatResult<Property>;
  Params: {
    propertyId: number;
  };
};

export function getPropertyRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<GetPropertiesRoute>,
    reply: FastifyReply<GetPropertiesRoute>,
  ) => {
    const { propertyId } = req.params;
    const property = await getProperty(fastify, {
      organizationId: req.user.organizationId,
      propertyId,
    });
    reply.status(200).send(formatResult(property));
  };
}
