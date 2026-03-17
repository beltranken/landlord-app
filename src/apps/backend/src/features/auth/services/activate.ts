import { eq, and, isNull } from "@db/drizzle";
import { usersTable } from "@db/schema";
import { ActivateRequest, UserStatus } from "@types";
import { FastifyInstance } from "fastify";
import { Conflict } from "http-errors";
import { getUserId } from "./getUserId";

export async function activate(
  fastify: FastifyInstance,
  param: ActivateRequest,
) {
  const userId = getUserId(fastify, param.token);

  if (Number.isNaN(userId)) {
    throw new Conflict("Malformed data");
  }

  const users = await fastify.db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.id, userId), isNull(usersTable.deletedAt)))
    .limit(1);

  const user = users.at(0);

  if (!user) {
    throw new Conflict("User does not exists");
  }

  await fastify.db
    .update(usersTable)
    .set({
      status: UserStatus.ACTIVE,
    })
    .where(eq(usersTable.id, userId));
}
