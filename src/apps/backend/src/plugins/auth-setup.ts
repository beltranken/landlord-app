import { handleJwtVerifyError } from "@backend/features/auth";
import fastifyJwt from "@fastify/jwt";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

const authSetupPluginImpl: FastifyPluginAsync = async (fastify, _options) => {
  fastify.log.info("Registering auth setup plugin");

  await fastify.register(fastifyJwt, {
    secret: fastify.config.JWT_SECRET,
  });

  await fastify.register(fastifyJwt, {
    namespace: "refresh",
    secret: fastify.config.JWT_REFRESH_SECRET,
  });

  fastify.decorate("authenticate", async (req: FastifyRequest) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      handleJwtVerifyError(err);
    }
  });
};

export const authSetupPlugin = fp(authSetupPluginImpl, {
  name: "auth-setup",
});
