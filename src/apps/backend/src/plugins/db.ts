import initDb from "../../../../shared/db/src/initDb";
import dotenv from "dotenv";
import { FastifyPluginCallback } from "fastify";

dotenv.config();

export const dbPlugin: FastifyPluginCallback = (fastify, _options, done) => {
  const { db, pool } = initDb();

  fastify.decorate("db", db);

  fastify.addHook("onClose", async (_instance) => {
    await pool.end();
  });

  done();
};
