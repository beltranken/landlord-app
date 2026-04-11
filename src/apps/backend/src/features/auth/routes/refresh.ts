import formatResult from "@backend/utils/formatResult";
import { RefreshRequest, RefreshResponse } from "@types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BadRequest } from "http-errors";
import { handleJwtVerifyError, login, processAuth } from "../services";

type RefreshRouteGeneric = {
  Body: RefreshRequest;
  Reply: RefreshResponse;
};

export function refreshRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<RefreshRouteGeneric>,
    reply: FastifyReply<RefreshRouteGeneric>,
  ) => {
    let refreshToken;

    if (req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    } else if (req.cookies.refresh_token) {
      refreshToken = req.cookies.refresh_token;
    } else {
      throw new BadRequest("Refresh token is required");
    }

    try {
      const { userId, organizationId } = await fastify.jwt.verify<{
        userId: number;
        organizationId: number;
      }>(refreshToken);

      const result = await login(fastify, { userId, organizationId });

      const authData = await processAuth({
        fastify,
        userId: result.user.id,
        organizationId,
        role: result.role,
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
          userId: result.user.id,
          organizationId: result.organizationId,
          ...authData,
        }),
      );
    } catch (err) {
      handleJwtVerifyError(err);
    }
  };
}
