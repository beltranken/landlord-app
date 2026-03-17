export default function formatResult<T>(
  data: T,
  message?: string,
): FormatResult<T> {
  return {
    success: message === undefined,
    data,
    message,
  };
}

export type FormatResult<T = unknown> = {
  success: boolean;
  data: T;
  message?: string;
};
