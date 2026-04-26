import formatResult, { FormatResult } from "@backend/utils/formatResult";
import type { CreateRentStep2 } from "@db/types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createRentStep2 } from "../services";

type CreateRentStep2Route = {
  Body: CreateRentStep2;
  Reply: FormatResult<{ rentId: number }>;
};

export function createRentStep2Route(fastify: FastifyInstance) {
  return async function (
    request: FastifyRequest<CreateRentStep2Route>,
    reply: FastifyReply<CreateRentStep2Route>,
  ) {
    const result = await createRentStep2(fastify, {
      ...request.body,
      userId: request.user.userId,
      organizationId: request.user.organizationId,
    });

    reply.status(200).send(formatResult(result));
  };
}
