import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { ConfirmForgotPasswordRequest } from "@types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { confirmForgotPassword } from "../services";

type ConfirmForgotPasswordRoute = {
  Body: ConfirmForgotPasswordRequest;
  Reply: FormatResult;
};

export function confirmForgotPasswordRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<ConfirmForgotPasswordRoute>,
    reply: FastifyReply<ConfirmForgotPasswordRoute>,
  ) => {
    await confirmForgotPassword(fastify, req.body);
    return reply.status(200).send(formatResult(undefined));
  };
}
