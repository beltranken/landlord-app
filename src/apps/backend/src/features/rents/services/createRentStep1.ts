import { notDeleted } from "@backend/utils/softDelete";
import { rentsTable } from "@db/schema";
import type { CreateRentStep1, WithUserIdAndOrganizationId } from "@db/types";
import { RentStatus } from "@db/types";
import type { FastifyInstance } from "fastify";
import { Conflict, NotFound } from "http-errors";

export async function createRentStep1(
  fastify: FastifyInstance,
  {
    organizationId,
    userId,
    ...rentData
  }: WithUserIdAndOrganizationId<CreateRentStep1>,
) {
  const { propertyId } = rentData;

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

  // 2. Check for existing draft rent on this property
  const existingDraft = await fastify.db.query.rentsTable.findFirst({
    where: {
      ...notDeleted,
      propertyId,
      status: RentStatus.DRAFT,
    },
  });

  if (existingDraft) {
    throw new Conflict("A draft rent already exists for this property");
  }

  // 3. Create the rent with draft status
  const [rent] = await fastify.db
    .insert(rentsTable)
    .values({
      propertyId,
      createdBy: userId,
      updatedBy: userId,
      status: RentStatus.DRAFT,
    })
    .returning({ id: rentsTable.id });

  return {
    rentId: rent.id,
  };
}
