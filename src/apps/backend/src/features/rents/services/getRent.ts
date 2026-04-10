import { notDeleted } from "@backend/utils/softDelete";
import type { Rent, WithOrganizationId } from "@db/types";
import type { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

export async function getRent(
  fastify: FastifyInstance,
  params: WithOrganizationId<{ rentId: number }>,
): Promise<Rent> {
  const { organizationId, rentId } = params;

  fastify.log.debug(
    `Getting rent with id: ${rentId} for organizationId: ${organizationId}`,
  );

  const properties = await fastify.db.query.propertiesTable.findMany({
    columns: {
      id: true,
    },
    where: {
      ...notDeleted,
      organizationId,
    },
  });

  const propertyIds = properties.map((property) => property.id);

  if (propertyIds.length === 0) {
    throw new NotFound("Rent not found");
  }

  const rent = await fastify.db.query.rentsTable.findFirst({
    where: {
      ...notDeleted,
      id: rentId,
      propertyId: {
        in: propertyIds,
      },
    },
  });

  if (!rent) {
    throw new NotFound("Rent not found");
  }

  return rent;
}
