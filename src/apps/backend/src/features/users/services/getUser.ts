import { notDeleted } from "@backend/utils/softDelete";
import { eq } from "@db/drizzle";
import { usersTable } from "@db/schema";
import { UserStatus } from "@enums";
import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function getUser(fastify: FastifyInstance, userId: number) {
  const [user] = await fastify.db
    .select()
    .from(usersTable)
    .where(notDeleted(usersTable, eq(usersTable.id, userId)))
    .limit(1);

  if (!user || user.status !== UserStatus.ACTIVE) {
    throw new NotFound();
  }

  return user;
}
