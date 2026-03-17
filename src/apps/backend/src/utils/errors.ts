import { baseResponseSchema } from "@types";

export const errorResponses = {
  400: baseResponseSchema.describe("Bad Request"),
  401: baseResponseSchema.describe("Unauthorized"),
  403: baseResponseSchema.describe("Forbidden"),
  409: baseResponseSchema.describe("Conflict"),
  500: baseResponseSchema.describe("Internal Server Error"),
} as const;
