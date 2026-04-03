import { FormatResult } from "./formatResult";

export default function formatResultWithPaging<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  message?: string,
): FormatResultWithPaging<T> {
  return {
    success: message === undefined,
    data,
    message,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}

export type FormatResultWithPaging<T> = {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
} & FormatResult<T[]>;
