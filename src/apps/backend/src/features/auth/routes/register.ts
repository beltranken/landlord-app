import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { RegisterRequest } from "@types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { register } from "../services";

type RegisterRouteGeneric = {
  Body: RegisterRequest;
  Reply: FormatResult;
};

export function registerRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<RegisterRouteGeneric>,
    reply: FastifyReply<RegisterRouteGeneric>,
  ) => {
    await register(fastify, req.body);
    return reply.status(201).send(formatResult(undefined));
  };
}
