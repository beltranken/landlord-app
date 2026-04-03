import { count, DBQueryConfig, KnownKeysOnly, sql } from "@db/drizzle";
import { Db } from "@db/initDb";
import { FastifyInstance } from "fastify";

export interface PagingOptions {
  page: number;
  size: number;
}

type TableNames = keyof Db["query"];
type RelationsSchema = NonNullable<Db["_"]["relations"]>;
export type Transaction = Parameters<Parameters<Db["transaction"]>[0]>[0];

interface FindPagedOptions<
  TTableName extends TableNames,
  TConfig extends DBQueryConfig<
    "many",
    RelationsSchema,
    RelationsSchema[TTableName]
  >,
> {
  paging: PagingOptions;
  config?: KnownKeysOnly<
    TConfig,
    DBQueryConfig<"many", RelationsSchema, RelationsSchema[TTableName]>
  >;
  tx?: Transaction;
}

/**
 * Runs a findMany query with paging and returns the result and total count.
 *
 * Config is identical to the one used in `drizzle-orm` findMany, minus the limit and offset.
 */
export async function findPaged<
  TTableName extends TableNames,
  TConfig extends DBQueryConfig<
    "many",
    RelationsSchema,
    RelationsSchema[TTableName]
  >,
>(
  fastify: FastifyInstance,
  table: TTableName,
  options: FindPagedOptions<TTableName, TConfig>,
) {
  const { paging, config, tx } = options;
  const txOrDb = tx || fastify.db;

  const baseConfig = (config ?? {}) as KnownKeysOnly<
    TConfig,
    DBQueryConfig<"many", RelationsSchema, RelationsSchema[TTableName]>
  >;

  const { with: _omitWith, ...countConfig } = baseConfig as any;

  const qCount = txOrDb.query[table].findMany({
    ...countConfig,
    columns: { id: true },
  } as any);

  const pagedConfig = {
    ...baseConfig,
    limit: paging.size,
    offset: paging.size * (paging.page - 1),
  } as KnownKeysOnly<
    TConfig,
    DBQueryConfig<"many", RelationsSchema, RelationsSchema[TTableName]>
  >;

  const [result, countResult] = await Promise.all([
    txOrDb.query[table].findMany(pagedConfig),
    txOrDb.select({ totalCount: count() }).from(sql`${qCount}`),
  ]);

  return {
    records: result,
    total: countResult?.[0]?.totalCount ?? 0,
  };
}
