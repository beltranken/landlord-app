import { authenticate } from "@backend/decorators";
import { errorResponses } from "@backend/utils/errors";
import {
  createPropertyResponseSchema,
  createPropertySchema,
  getPropertyParamsSchema,
  getPropertyResponseSchema,
  propertiesResponseSchema,
} from "@db/types";
import { pagingRequestSchema } from "@types";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createPropertyRoute,
  getPropertiesRoute,
  getPropertyRoute,
} from "./routes";

export const propertiesPlugin: FastifyPluginAsync = async (
  fastify,
  _options,
) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  fastify.addHook("preHandler", authenticate(fastify));

  typedFastify.get(
    "/:propertyId",
    {
      schema: {
        operationId: "getProperty",
        params: getPropertyParamsSchema,
        response: {
          200: getPropertyResponseSchema,
          ...errorResponses,
        },
      },
    },
    getPropertyRoute(fastify),
  );

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

  typedFastify.post(
    "/",
    {
      schema: {
        operationId: "createProperty",
        body: createPropertySchema,
        response: {
          200: createPropertyResponseSchema,
          ...errorResponses,
        },
      },
    },
    createPropertyRoute(fastify),
  );
};
