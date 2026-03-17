import fastifyJwt from "@fastify/jwt";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { authenticate } from "../decorators";

const authSetupPluginImpl: FastifyPluginAsync = async (fastify, _options) => {
  await fastify.register(fastifyJwt, {
    secret: fastify.config.JWT_SECRET,
  });

  await fastify.register(fastifyJwt, {
    namespace: "refresh",
    secret: fastify.config.JWT_REFRESH_SECRET,
  });

  fastify.decorate("authenticate", authenticate);
};

export const authSetupPlugin = fp(authSetupPluginImpl, {
  name: "auth-setup",
});
