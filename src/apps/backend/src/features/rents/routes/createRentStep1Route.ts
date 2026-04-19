import formatResult, { FormatResult } from "@backend/utils/formatResult";
import type { CreateRentStep1 } from "@db/types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createRentStep1 } from "../services";

type CreateRentStep1Route = {
  Body: CreateRentStep1;
  Reply: FormatResult<{ rentId: number }>;
};

export function createRentStep1Route(fastify: FastifyInstance) {
  return async function (
    request: FastifyRequest<CreateRentStep1Route>,
    reply: FastifyReply<CreateRentStep1Route>,
  ) {
    const createdRent = await createRentStep1(fastify, {
      ...request.body,
      userId: request.user.userId,
      organizationId: request.user.organizationId,
    });

    reply.status(201).send(formatResult(createdRent));
  };
}
