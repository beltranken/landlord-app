import { Unauthorized } from "http-errors";

export function handleJwtVerifyError(err: unknown) {
  const isError = err instanceof Error;
  if (!isError) {
    throw err;
  }

  if (err.name === "JsonWebTokenError") {
    throw new Unauthorized("Unable to decode jwt");
  } else if (err.name === "TokenExpiredError") {
    throw new Unauthorized("Access token is expired");
  } else {
    throw err;
  }
}
