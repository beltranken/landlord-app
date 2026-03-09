import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import * as schema from "./schema.js";

dotenv.config();

export const initDb = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  const db = drizzle({
    client: pool,
    schema,
  });

  return { db, pool };
};

export default initDb;
