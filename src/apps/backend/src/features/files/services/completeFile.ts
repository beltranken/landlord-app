import { eq } from "@db/drizzle";
import { filesTable } from "@db/schema";
import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function completeFile(
  fastify: FastifyInstance,
  {
    fileId,
    userId,
  }: {
    fileId: number;
    userId: number;
  },
) {
  fastify.log.debug(
    `Completing file for fileId: ${fileId} by userId: ${userId}`,
  );

  const file = await fastify.db.query.filesTable.findFirst({
    where: {
      id: fileId,
      createdBy: userId,
      deletedAt: {
        isNull: true,
      },
    },
  });

  if (!file) {
    throw new NotFound("File not found");
  }

  await fastify.db
    .update(filesTable)
    .set({
      isCompleted: true,
      updatedBy: userId,
      updatedAt: new Date(),
    })
    .where(eq(filesTable.id, fileId));
}
