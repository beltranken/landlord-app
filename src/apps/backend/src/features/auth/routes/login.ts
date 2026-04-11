import formatResult from "@backend/utils/formatResult";
import { LoginRequest, LoginResponse } from "@types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { login, processAuth } from "../services";

type LoginRouteGeneric = {
  Body: LoginRequest;
  Reply: LoginResponse;
};

export function loginRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<LoginRouteGeneric>,
    reply: FastifyReply<LoginRouteGeneric>,
  ) => {
    const result = await login(fastify, {
      email: req.body.email,
      password: req.body.password,
    });

    const authData = await processAuth({
      fastify,
      userId: result.user.id,
      role: result.role,
      organizationId: result.organizationId,
      reply,
    });

    reply.setCookie("refresh_token", authData.refreshToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: authData.jwtRefreshExpiry / 1000,
    });

    reply.status(200).send(
      formatResult({
        ...authData,
        organizationId: result.organizationId,
        userId: result.user.id,
      }),
    );
  };
}
