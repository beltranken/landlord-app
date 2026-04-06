import { authenticate } from "@backend/decorators";
import createResponseWrapper from "@backend/utils/createResponseWrapper";
import { errorResponses } from "@backend/utils/errors";
import paginatedResponseWrapper from "@backend/utils/paginatedResponseWrapper";
import paramSchema from "@backend/utils/paramSchema";
import responseWrapper from "@backend/utils/responseWrapper";
import { tenantSchema } from "@db/types";
import { pagingRequestSchema } from "@types";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createTenantRoute, getTenantRoute, getTenantsRoute } from "./routes";

export const tenantsPlugin: FastifyPluginAsync = async (fastify, _options) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  fastify.addHook("preHandler", authenticate(fastify));

  typedFastify.get(
    "/:tenantId",
    {
      schema: {
        operationId: "getTenant",
        params: paramSchema("tenantId"),
        response: {
          200: responseWrapper(tenantSchema),
          ...errorResponses,
        },
      },
    },
    getTenantRoute(fastify),
  );

  typedFastify.get(
    "/",
    {
      schema: {
        operationId: "getTenants",
        querystring: pagingRequestSchema,
        response: {
          200: paginatedResponseWrapper(tenantSchema),
          ...errorResponses,
        },
      },
    },
    getTenantsRoute(fastify),
  );

  typedFastify.post(
    "/",
    {
      schema: {
        operationId: "createTenant",
        body: tenantSchema,
        response: {
          201: responseWrapper(createResponseWrapper("tenantId")),
          ...errorResponses,
        },
      },
    },
    createTenantRoute(fastify),
  );
};
