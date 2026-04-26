import formatResult from "@backend/utils/formatResult";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { completeFile } from "../services";

export type UpdateFileCompletionRoute = {
  Params: {
    fileId: number;
  };
};

export function completeFileRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<UpdateFileCompletionRoute>,
    reply: FastifyReply<UpdateFileCompletionRoute>,
  ) => {
    const { fileId } = req.params;

    await completeFile(fastify, {
      fileId,
      userId: req.user.userId,
    });

    reply.status(200).send(formatResult(undefined));
  };
}
