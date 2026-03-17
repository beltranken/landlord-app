import { errorResponses } from "@backend/utils/errors";
import {
  activateRequestSchema,
  confirmForgotPasswordRequestSchema,
  forgotPasswordRequestSchema,
  loginRequestSchema,
  loginResponseSchema,
  refreshRequestSchema,
  refreshResponseSchema,
  registerRequestSchema,
} from "@types";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  activateRoute,
  confirmForgotPasswordRoute,
  forgotPasswordRoute,
  loginRoute,
  logoutRoute,
  refreshRoute,
  registerRoute,
} from "./routes";

export const authPlugin: FastifyPluginAsync = async (fastify, _options) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  typedFastify.post(
    "/sign-in",
    {
      schema: {
        operationId: "signIn",
        body: loginRequestSchema,
        response: {
          200: loginResponseSchema,
          ...errorResponses,
        },
      },
    },
    loginRoute(fastify),
  );

  typedFastify.post(
    "/sign-out",
    {
      schema: {
        operationId: "signOut",
        response: {
          ...errorResponses,
        },
      },
    },
    logoutRoute(fastify),
  );

  typedFastify.post(
    "/refresh",
    {
      schema: {
        operationId: "refresh",
        body: refreshRequestSchema,
        response: {
          200: refreshResponseSchema,
          ...errorResponses,
        },
      },
    },
    refreshRoute(fastify),
  );

  typedFastify.post(
    "/sign-up",
    {
      schema: {
        operationId: "signUp",
        body: registerRequestSchema,
        response: {
          ...errorResponses,
        },
      },
    },
    registerRoute(fastify),
  );

  typedFastify.post(
    "/activate",
    {
      schema: {
        operationId: "activate",
        body: activateRequestSchema,
        response: {
          ...errorResponses,
        },
      },
    },
    activateRoute(fastify),
  );

  typedFastify.post(
    "/forgot-password",
    {
      schema: {
        operationId: "forgotPassword",
        body: forgotPasswordRequestSchema,
        response: {
          ...errorResponses,
        },
      },
    },
    forgotPasswordRoute(fastify),
  );

  typedFastify.post(
    "/confirm-forgot-password",
    {
      schema: {
        operationId: "confirmForgotPassword",
        body: confirmForgotPasswordRequestSchema,
        response: {
          ...errorResponses,
        },
      },
    },
    confirmForgotPasswordRoute(fastify),
  );
};
