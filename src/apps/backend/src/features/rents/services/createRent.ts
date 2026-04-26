import { notDeleted } from "@backend/utils/softDelete";
import { rentsTable } from "@db/schema";
import type { CreateRent, WithUserIdAndOrganizationId } from "@db/types";
import { RentStatus } from "@db/types";
import type { FastifyInstance } from "fastify";
import { Conflict, NotFound } from "http-errors";

export async function createRent(
  fastify: FastifyInstance,
  {
    organizationId,
    userId,
    ...rentData
  }: WithUserIdAndOrganizationId<CreateRent>,
) {
  const { propertyId, startDate, endDate } = rentData;

  // 1. Check if the property exists and belongs to the organization
  const property = await fastify.db.query.propertiesTable.findFirst({
    where: {
      ...notDeleted,
      id: propertyId,
      organizationId,
    },
  });

  if (!property) {
    throw new NotFound("Property not found");
  }

  // 2. Check for overlapping active rents on this property
  const overlappingRent = await fastify.db.query.rentsTable.findFirst({
    where: {
      ...notDeleted,
      propertyId,
      status: {
        in: [RentStatus.ACTIVE, RentStatus.DRAFT],
      },
      startDate: endDate ? { lte: endDate } : undefined,
      endDate: startDate ? { gte: startDate } : undefined,
    },
  });

  if (overlappingRent) {
    throw new Conflict(
      "An active rent already exists for this property with overlapping dates",
    );
  }

  // 3. Create the rent
  const [rent] = await fastify.db
    .insert(rentsTable)
    .values({
      ...rentData,
      createdBy: userId,
      updatedBy: userId,
    })
    .returning({ id: rentsTable.id });

  return {
    rentId: rent.id,
  };
}
