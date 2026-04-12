import { UserRole } from "@db/types";
import { FastifyRequest } from "fastify";
import { Forbidden } from "http-errors";

export const checkPermission = (allowedRoles: UserRole[]) => {
  return async function (request: FastifyRequest) {
    if (!allowedRoles.includes(request.user.role)) {
      throw new Forbidden(
        `Insufficient permissions. Required: ${allowedRoles.join(" or ")}`,
      );
    }
  };
};

export const requireAdmin = () => checkPermission([UserRole.ADMIN]);

export const requireAdminOrCollector = () =>
  checkPermission([UserRole.ADMIN, UserRole.COLLECTOR]);
export const requireAnyRole = () =>
  checkPermission([UserRole.ADMIN, UserRole.COLLECTOR, UserRole.USER]);
