import { authenticate, requireAdminOrCollector } from "@backend/decorators";
import createResponseWrapper from "@backend/utils/createResponseWrapper";
import { errorResponses } from "@backend/utils/errors";
import paginatedRequestWrapper from "@backend/utils/paginatedRequestWrapper";
import paginatedResponseWrapper from "@backend/utils/paginatedResponseWrapper";
import paramSchema from "@backend/utils/paramSchema";
import responseWrapper from "@backend/utils/responseWrapper";
import {
  createRentSchema,
  createRentStep1Schema,
  createRentStep2Schema,
  rentSchema,
  rentsFilterSchema,
} from "@db/types";
import type { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createRentRoute,
  createRentStep1Route,
  createRentStep2Route,
  getRentRoute,
  getRentsRoute,
} from "./routes/";

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

  typedFastify.post(
    "/",
    {
      schema: {
        operationId: "createRent",
        body: createRentSchema,
        response: {
          201: responseWrapper(createResponseWrapper("rentId")),
          ...errorResponses,
        },
      },
    },
    createRentRoute(fastify),
  );

  typedFastify.post(
    "/step1",
    {
      schema: {
        operationId: "createRentStep1",
        body: createRentStep1Schema,
        response: {
          201: responseWrapper(createResponseWrapper("rentId")),
          ...errorResponses,
        },
      },
    },
    createRentStep1Route(fastify),
  );

  typedFastify.post(
    "/step2",
    {
      schema: {
        operationId: "createRentStep2",
        body: createRentStep2Schema,
        response: {
          200: responseWrapper(createResponseWrapper("rentId")),
          ...errorResponses,
        },
      },
    },
    createRentStep2Route(fastify),
  );
};
