import { dbPlugin } from "./plugins";
import { authPlugin } from "./routes";
import env from "@fastify/env";
import dotenv from "dotenv";
import Fastify from "fastify";
import { createLogger, Level } from "./utils/logger";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

dotenv.config();

const schema = {
  type: "object",
  required: ["PORT", "DATABASE_URL", "JWT_SECRET"],
  properties: {
    PORT: {
      type: "string",
      default: "8000",
    },
    DATABASE_URL: {
      type: "string",
    },
    PINO_LOG_LEVEL: {
      type: "string",
      default: "error",
    },
    NODE_ENV: {
      type: "string",
      default: "development",
    },
    JWT_SECRET: {
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

  await fastify
    .register(env, {
      schema,
      dotenv: true,
    })
    .after();

  await fastify.register(dbPlugin);

  // routes
  await fastify.register(authPlugin, { prefix: "/api/auth" });

  return fastify;
};
