import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isHttpError } from "http-errors";

type HandlerFunction<T> = (
  req: FastifyRequest,
  reply: FastifyReply<T>,
) => Promise<void>;

export const requestWrapper = (
  fastify: FastifyInstance,
  requestFn: HandlerFunction,
) => {
  return async (req: FastifyRequest, reply: FastifyReply<T>) => {
    try {
      await requestFn(req, reply);
    } catch (e) {
      if (e instanceof Error) {
        fastify.log.error(e);
        reply.status(500).send({ error: e.message });
      }

      if (isHttpError(e)) {
        fastify.log.info(e);
        reply.status(e.statusCode).send({ error: e.message });
      }

      fastify.log.error(e);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  };
};
