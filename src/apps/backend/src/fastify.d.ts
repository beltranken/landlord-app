import "@backend/fastify";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { FastifyRequest, FastifyReply } from "@backend/fastify";
import type { Pool } from "pg";
import initDb from "@db/initDb";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: string;
      DATABASE_URL: string;
      PINO_LOG_LEVEL: string;
      NODE_ENV: string;
      JWT_SECRET: string;
    };
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    db: ReturnType<typeof initDb>["db"];
  }
}
