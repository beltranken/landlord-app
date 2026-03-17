import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { LoginRequest } from "@types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

type LoginRouteGeneric = {
  Body: LoginRequest;
  Reply: FormatResult;
};

export function logoutRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<LoginRouteGeneric>,
    reply: FastifyReply<LoginRouteGeneric>,
  ) => {
    reply.clearCookie("refresh_token", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    reply.status(200).send(formatResult(undefined));
  };
}
