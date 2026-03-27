import formatResult, { FormatResult } from "@backend/utils/formatResult";
import { User } from "@db/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getUser } from "../services";

type GetCurrentUserRoute = {
  Reply: FormatResult<User>;
};

export function getCurrentUserRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<GetCurrentUserRoute>,
    reply: FastifyReply<GetCurrentUserRoute>,
  ) => {
    const user = await getUser(fastify, req.user.userId);
    reply.status(200).send(formatResult(user));
  };
}
