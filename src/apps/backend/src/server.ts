import "dotenv/config";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import env from "@fastify/env";
import Fastify from "fastify";
import { authPlugin } from "./features";
import { propertiesPlugin } from "./features/properties/plugin";
import { tenantsPlugin } from "./features/tenants/plugin";
import { usersPlugin } from "./features/users";
import {
  authSetupPlugin,
  dbPlugin,
  errorHandlerPlugin,
  s3Plugin,
  swaggerSetupPlugin,
} from "./plugins";
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
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "S3_ENDPOINT",
    "S3_BUCKET_NAME",
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
    AWS_REGION: {
      type: "string",
      default: "auto",
    },
    AWS_ACCESS_KEY_ID: {
      type: "string",
    },
    AWS_SECRET_ACCESS_KEY: {
      type: "string",
    },
    S3_ENDPOINT: {
      type: "string",
    },
    S3_BUCKET_NAME: {
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
  await fastify.register(s3Plugin);

  await fastify.register(cors, {
    credentials: true,
    origin: (origin, cb) => {
      try {
        const hostname = new URL(origin!).hostname;
        if (hostname === "localhost") {
          cb(null, true);
          return;
        }

        cb(new Error("Not allowed"), false);
      } catch (err) {
        cb(new Error("Invalid origin"), false);
      }
    },
  });

  // Error handler
  await fastify.register(errorHandlerPlugin);

  await fastify.register(authSetupPlugin);

  // routes
  await fastify.register(authPlugin, { prefix: "/api/auth" });
  await fastify.register(usersPlugin, { prefix: "/api/users" });
  await fastify.register(propertiesPlugin, { prefix: "/api/properties" });
  await fastify.register(tenantsPlugin, { prefix: "/api/tenants" });

  await fastify.ready();

  return fastify;
};
