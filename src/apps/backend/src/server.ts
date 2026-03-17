import "dotenv/config";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import env from "@fastify/env";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { authPlugin } from "./features";
import { dbPlugin, errorHandlerPlugin } from "./plugins";
import { authSetupPlugin } from "./plugins/auth-stepup";
import { swaggerSetupPlugin } from "./plugins/swagger-setup";
import { createLogger, Level } from "./utils/logger";

const schema = {
  type: "object",
  required: [
    "PORT",
    "DATABASE_URL",
    "COOKIE_SECRET",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "POSTMARK_SERVER_TOKEN",
    "EMAIL_FROM",
  ],
  properties: {
    PORT: {
      type: "string",
      default: "8000",
    },
    NODE_ENV: {
      type: "string",
      default: "development",
    },
    PINO_LOG_LEVEL: {
      type: "string",
      default: "error",
    },
    DATABASE_URL: {
      type: "string",
    },
    VERIFY_EMAIL: {
      type: "boolean",
      default: true,
    },
    COOKIE_SECRET: {
      type: "string",
    },
    JWT_SECRET: {
      type: "string",
    },
    JWT_REFRESH_SECRET: {
      type: "string",
    },
    JWT_ACCESS_EXPIRY: {
      type: "string",
      default: "1d",
    },
    JWT_REFRESH_EXPIRY: {
      type: "string",
      default: "7d",
    },
    POSTMARK_SERVER_TOKEN: {
      type: "string",
    },
    EMAIL_FROM: {
      type: "string",
    },
  },
};

const level = process.env.PINO_LOG_LEVEL as Level;
const isDev = process.env.NODE_ENV === "development";
const logger = createLogger({ level, isDev });

export { logger };

export const createServer = async () => {
  const fastify = Fastify({
    loggerInstance: logger,
  });

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.get("/ping", (_request, reply) => {
    reply.send({ message: "pong" });
  });

  await fastify.register(env, {
    schema,
    dotenv: true,
  });

  await fastify.register(swaggerSetupPlugin);

  await fastify.register(cookie, {
    secret: fastify.config.COOKIE_SECRET,
  });
  await fastify.register(dbPlugin);

  await fastify.register(cors, {
    credentials: true,
    origin: (origin, cb) => {
      const hostname = new URL(origin!).hostname;
      if (hostname === "localhost") {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed"), false);
    },
  });

  // Error handler
  await fastify.register(errorHandlerPlugin);

  await fastify.register(authSetupPlugin);

  // routes
  await fastify.register(authPlugin, { prefix: "/api/auth" });

  await fastify.ready();

  return fastify;
};
