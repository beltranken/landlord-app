import { createServer } from "../server";
import fs from "fs";
import path from "path";

async function generate() {
  const app = await createServer();

  await app.ready();

  const spec = app.swagger();

  const filePath = path.join(process.cwd(), "openapi.json");

  fs.writeFileSync(filePath, JSON.stringify(spec, null, 2));

  console.log("OpenAPI spec generated:", filePath);

  await app.close();
}

generate();
