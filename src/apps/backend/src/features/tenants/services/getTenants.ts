import { notDeleted } from "@backend/utils/softDelete";
import { count, sql } from "@db/drizzle";
import { PagingRequest } from "@types";
import { FastifyInstance } from "fastify";

type GetTenantsParam = {
  organizationId: number;
} & Partial<PagingRequest>;

export async function getTenants(
  fastify: FastifyInstance,
  { organizationId, page = 1, pageSize = 50 }: GetTenantsParam,
) {
  fastify.log.debug(`Getting tenants for organizationId: ${organizationId}`);

  // TODO: apply filters

  const where = {
    ...notDeleted,
    organizationId,
  };

  const countQuery = fastify.db.query.tenantsTable.findMany({
    columns: {
      id: true,
    },
    where,
  });

  const [tenants, [{ total }]] = await Promise.all([
    fastify.db.query.tenantsTable.findMany({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      where,
    }),
    fastify.db.select({ total: count() }).from(sql`${countQuery}`),
  ]);

  return {
    total,
    tenants,
    page,
    pageSize,
  };
}
