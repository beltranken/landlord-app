import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { ForgotPasswordRequest } from "@types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { forgotPassword } from "../services";

type ForgotPasswordRoute = {
  Body: ForgotPasswordRequest;
  Reply: FormatResult;
};

export function forgotPasswordRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<ForgotPasswordRoute>,
    reply: FastifyReply<ForgotPasswordRoute>,
  ) => {
    await forgotPassword(fastify, req.body);
    return reply.status(200).send(formatResult(undefined));
  };
}
