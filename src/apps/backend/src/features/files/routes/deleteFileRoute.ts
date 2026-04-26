import formatResult from "@backend/utils/formatResult";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { deleteFile } from "../services";

export type DeleteFileRoute = {
  Params: {
    fileId: number;
  };
};

export function deleteFileRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<DeleteFileRoute>,
    reply: FastifyReply<DeleteFileRoute>,
  ) => {
    const { fileId } = req.params;

    await deleteFile(fastify, {
      fileId,
      userId: req.user.userId,
    });

    reply.status(200).send(formatResult(undefined));
  };
}
