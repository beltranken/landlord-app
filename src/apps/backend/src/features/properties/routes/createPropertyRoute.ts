import formatResult from "@backend/utils/formatResult";
import { CreateProperty, CreatePropertyResponse } from "@db/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createProperty } from "../services";

type CreatePropertyRoute = {
  Body: CreateProperty;
  Reply: CreatePropertyResponse;
};

export function createPropertyRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<CreatePropertyRoute>,
    reply: FastifyReply<CreatePropertyRoute>,
  ) => {
    const propertyId = await createProperty(fastify, {
      ...req.body,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
    });
    reply.status(200).send(formatResult(propertyId));
  };
}
