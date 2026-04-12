import { authenticate, requireAdminOrCollector } from "@backend/decorators";
import { errorResponses } from "@backend/utils/errors";
import paginatedRequestWrapper from "@backend/utils/paginatedRequestWrapper";
import paginatedResponseWrapper from "@backend/utils/paginatedResponseWrapper";
import paramSchema from "@backend/utils/paramSchema";
import responseWrapper from "@backend/utils/responseWrapper";
import { rentSchema, rentsFilterSchema } from "@db/types";
import type { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { getRentRoute } from "./routes/getRentRoute";
import { getRentsRoute } from "./routes/getRentsRoute";

export const rentsPlugin: FastifyPluginAsync = async (fastify, _options) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  fastify.addHook("preHandler", authenticate(fastify));
  fastify.addHook("preHandler", requireAdminOrCollector());

  typedFastify.get(
    "/:rentId",
    {
      schema: {
        operationId: "getRent",
        params: paramSchema("rentId"),
        response: {
          200: responseWrapper(rentSchema),
          ...errorResponses,
        },
      },
    },
    getRentRoute(fastify),
  );

  typedFastify.get(
    "/",
    {
      schema: {
        operationId: "getRents",
        querystring: paginatedRequestWrapper(rentsFilterSchema),
        response: {
          200: paginatedResponseWrapper(rentSchema),
          ...errorResponses,
        },
      },
    },
    getRentsRoute(fastify),
  );
};
