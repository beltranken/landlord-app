import { notDeleted } from "@backend/utils/softDelete";
import { UserStatus } from "@enums";
import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function getUser(fastify: FastifyInstance, userId: number) {
  const user = await fastify.db.query.usersTable.findFirst({
    where: {
      ...notDeleted,
      id: userId,
    },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    throw new NotFound();
  }

  return user;
}
