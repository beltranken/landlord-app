import { notDeleted } from "@backend/utils/softDelete";
import { count, sql } from "@db/drizzle";
import type {
  BaseRequestWithPaging,
  Rent,
  RentsFilter,
  WithOrganizationId,
} from "@db/types";
import type { FastifyInstance } from "fastify";

type GetRentsParams = WithOrganizationId<BaseRequestWithPaging & RentsFilter>;

export async function getRents(
  fastify: FastifyInstance,
  {
    organizationId,
    tenantId,
    page = 1,
    propertyId,
    pageSize = 50,
  }: GetRentsParams,
): Promise<{
  total: number;
  rents: Rent[];
  page: number;
  pageSize: number;
}> {
  fastify.log.debug(
    `Getting rents for organizationId: ${organizationId}, page: ${page}, pageSize: ${pageSize}`,
  );

  const where = {
    ...notDeleted,
    property: {
      ...notDeleted,
    },
  };

  let tennantWhere = {};
  if (Number.isFinite(tenantId)) {
    tennantWhere = {
      rentTenants: {
        tenantId: Number(tenantId),
      },
    };
  }

  let propertyWhere = {};
  if (Number.isFinite(propertyId)) {
    propertyWhere = {
      propertyId: Number(propertyId),
    };
  }

  const countQuery = fastify.db.query.rentsTable.findMany({
    columns: {
      id: true,
    },
    where: {
      ...where,
      ...tennantWhere,
      ...propertyWhere,
    },
  });

  const [rents, [{ total }]] = await Promise.all([
    fastify.db.query.rentsTable.findMany({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      where: {
        ...where,
        ...tennantWhere,
        ...propertyWhere,
      },
      with: {
        property: true,
        rentTenants: true,
      },
    }),
    fastify.db.select({ total: count() }).from(sql`${countQuery}`),
  ]);

  return {
    total,
    rents,
    page,
    pageSize,
  };
}
