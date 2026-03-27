import { notDeleted } from "@backend/utils/softDelete";
import { count } from "@db/drizzle";
import { propertiesTable } from "@db/schema";
import { PagingRequest, PropertyStatus } from "@types";
import { FastifyInstance } from "fastify";

type GetPropertiesParam = {
  filter?: {
    statuses?: PropertyStatus[];
  };
} & PagingRequest;

export async function getProperties(
  fastify: FastifyInstance,
  { filter, page, pageSize }: GetPropertiesParam = {
    filter: {},
    page: 1,
    pageSize: 50,
  },
) {
  fastify.log.info(
    `Getting properties with filter: ${JSON.stringify(filter)}, page: ${page}, pageSize: ${pageSize}`,
  );

  // TODO: apply filters

  const where = notDeleted(propertiesTable);

  const [{ total }] = await fastify.db
    .select({ total: count() })
    .from(propertiesTable)
    .where(where);

  const properties = await fastify.db
    .select()
    .from(propertiesTable)
    .where(where)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { total, properties, page, pageSize };
}
