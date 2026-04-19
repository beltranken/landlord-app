import formatResult, { FormatResult } from "@backend/utils/formatResult";
import type { CreateRent } from "@db/types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createRent } from "../services";

type CreateRentRoute = {
  Body: CreateRent;
  Reply: FormatResult<{ rentId: number }>;
};

export function createRentRoute(fastify: FastifyInstance) {
  return async function (
    request: FastifyRequest<CreateRentRoute>,
    reply: FastifyReply<CreateRentRoute>,
  ) {
    const createdRent = await createRent(fastify, {
      ...request.body,
      userId: request.user.userId,
      organizationId: request.user.organizationId,
    });

    reply.status(201).send(formatResult(createdRent));
  };
}
