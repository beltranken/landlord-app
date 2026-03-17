import { FastifyRequest } from "fastify";
import { handleJwtVerifyError } from "../features/auth/services/handleJwtVerifyError";

export async function authenticate(req: FastifyRequest) {
  try {
    await req.jwtVerify();
  } catch (err) {
    handleJwtVerifyError(err);
  }
}
