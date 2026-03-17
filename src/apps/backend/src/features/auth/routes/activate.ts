import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { ActivateRequest } from "@types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { activate } from "../services";

type ActivateRouteGeneric = {
  Body: ActivateRequest;
  Reply: FormatResult;
};

export function activateRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<ActivateRouteGeneric>,
    reply: FastifyReply<ActivateRouteGeneric>,
  ) => {
    await activate(fastify, req.body);
    return reply.status(200).send(formatResult(undefined));
  };
}
