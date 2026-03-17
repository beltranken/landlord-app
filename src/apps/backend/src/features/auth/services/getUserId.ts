import { FastifyInstance } from "fastify";
import { Conflict } from "http-errors";

export function getUserId(fastify: FastifyInstance, token: string): number {
  const decoded = fastify.jwt.verify(token);

  if (!(typeof decoded === "object") || !("userId" in decoded)) {
    throw new Conflict("Malformed data");
  }

  const userId = Number(decoded.userId);

  return userId;
}
