import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Db = NodePgDatabase<typeof schema> & {
  $client: Pool;
};

export const initDb = (dbConnectionString?: string) => {
  const pool = new Pool({
    connectionString: dbConnectionString,
    ssl: false,
    min: 1,
  });

  pool.on("error", (err) => {
    console.error("Unexpected Postgres pool error", err);
  });

  const db = drizzle({
    client: pool,
    schema,
  });

  return { db, pool };
};

export default initDb;
