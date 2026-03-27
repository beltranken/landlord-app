import { errorResponses } from "@backend/utils/errors";
import { propertiesResponseSchema } from "@db/types";
import { pagingRequestSchema } from "@types";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { getPropertiesRoute } from "./routes";

export const propertiesPlugin: FastifyPluginAsync = async (
  fastify,
  _options,
) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  fastify.addHook("preHandler", async (request, reply) => {
    await fastify.authenticate(request, reply);
  });

  typedFastify.get(
    "/",
    {
      schema: {
        operationId: "getProperties",
        querystring: pagingRequestSchema,
        response: {
          200: propertiesResponseSchema,
          ...errorResponses,
        },
      },
    },
    getPropertiesRoute(fastify),
  );
};
