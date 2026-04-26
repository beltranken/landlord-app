import { authenticate } from "@backend/decorators";
import { errorResponses } from "@backend/utils/errors";
import paramSchema from "@backend/utils/paramSchema";
import { baseResponseSchema } from "@types";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { completeFileRoute, deleteFileRoute } from "./routes";

export const filesPlugin: FastifyPluginAsync = async (fastify, _options) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  fastify.addHook("preHandler", authenticate(fastify));

  typedFastify.patch(
    "/:fileId/completed",
    {
      schema: {
        operationId: "updateFileCompletion",
        params: paramSchema("fileId"),
        response: {
          200: baseResponseSchema,
          ...errorResponses,
        },
      },
    },
    completeFileRoute(fastify),
  );

  typedFastify.delete(
    "/:fileId",
    {
      schema: {
        operationId: "deleteFile",
        params: paramSchema("fileId"),
        response: {
          200: baseResponseSchema,
          ...errorResponses,
        },
      },
    },
    deleteFileRoute(fastify),
  );
};
