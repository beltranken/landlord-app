import { Unauthorized } from "http-errors";
import { handleJwtVerifyError } from "./handleJwtVerifyError";

function makeNamedError(name: string, message = "msg"): Error {
  const err = new Error(message);
  err.name = name;
  return err;
}

describe("handleJwtVerifyError", () => {
  it("rethrows non-Error values", () => {
    const nonError = { foo: "bar" };

    expect(() => handleJwtVerifyError(nonError as unknown)).toThrow(undefined);
  });

  it("throws Unauthorized for JsonWebTokenError", () => {
    const err = makeNamedError("JsonWebTokenError", "invalid token");

    expect(() => handleJwtVerifyError(err)).toThrow(Unauthorized);
    expect(() => handleJwtVerifyError(err)).toThrow("Unable to decode jwt");
  });

  it("throws Unauthorized for TokenExpiredError", () => {
    const err = makeNamedError("TokenExpiredError", "expired token");

    expect(() => handleJwtVerifyError(err)).toThrow(Unauthorized);
    expect(() => handleJwtVerifyError(err)).toThrow("Access token is expired");
  });

  it("rethrows other Error instances unchanged", () => {
    const original = makeNamedError("SomeOtherError", "boom");

    try {
      handleJwtVerifyError(original);
      // If no error is thrown, fail the test explicitly
      fail("Expected handleJwtVerifyError to throw");
    } catch (err) {
      expect(err).toBe(original);
    }
  });
});
