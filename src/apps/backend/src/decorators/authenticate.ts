import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const authenticate = (fastify: FastifyInstance) => {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    await fastify.authenticate(request, reply);
  };
};
