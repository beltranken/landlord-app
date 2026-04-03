import { authenticate } from "@backend/decorators";
import { errorResponses } from "@backend/utils/errors";
import { userResponseSchema } from "@db/types";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { getCurrentUserRoute } from "./routes";

export const usersPlugin: FastifyPluginAsync = async (fastify, _options) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  fastify.addHook("preHandler", authenticate(fastify));

  typedFastify.get(
    "/me",
    {
      schema: {
        operationId: "getCurrentUser",
        response: {
          200: userResponseSchema,
          ...errorResponses,
        },
      },
    },
    getCurrentUserRoute(fastify),
  );
};
