import initDb from "@db/initDb";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const dbPluginImpl: FastifyPluginAsync = async (fastify, _options) => {
  const { db, pool } = initDb(fastify.config.DATABASE_URL);

  fastify.decorate("db", db);

  fastify.addHook("onClose", async (_instance) => {
    console.log("Closing database pool...");
    await pool.end();
  });
};

export const dbPlugin = fp(dbPluginImpl, {
  name: "db",
});
