import { and, AnyColumn, isNull } from "@db/drizzle";

export type TableWithDeletedAt = {
  deletedAt: AnyColumn;
};

export function notDeleted(
  table: TableWithDeletedAt,
  ...conditions: Parameters<typeof and>
) {
  return and(isNull(table.deletedAt), ...conditions);
}
