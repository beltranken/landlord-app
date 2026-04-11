import { and, eq, isNull } from "@db/drizzle";
import {
  organizationsTable,
  organizationUsersTable,
  usersTable,
} from "@db/schema";
import { User, UserRole } from "@db/types";
import { UserStatus } from "@types";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { Unauthorized } from "http-errors";

type RefreshParams =
  | {
      email: string;
      password: string;
    }
  | { userId: number; organizationId: number };

export async function login(
  fastify: FastifyInstance,
  param: RefreshParams,
): Promise<{
  organizationId: number;
  user: User;
  role: UserRole;
}> {
  let password = "";
  let where = [isNull(usersTable.deletedAt)];
  let userId;

  if ("userId" in param) {
    where.push(eq(usersTable.id, param.userId));
    where.push(eq(organizationUsersTable.organizationId, param.organizationId));
    userId = param.userId;
  } else {
    where.push(eq(usersTable.email, param.email));
    password = param.password;
  }

  const users = await fastify.db
    .select()
    .from(usersTable)
    .innerJoin(
      organizationUsersTable,
      and(
        eq(usersTable.id, organizationUsersTable.userId),
        isNull(organizationUsersTable.deletedAt),
      ),
    )
    .innerJoin(
      organizationsTable,
      and(
        eq(organizationUsersTable.organizationId, organizationsTable.id),
        isNull(organizationsTable.deletedAt),
      ),
    )
    .where(and(...where))
    .limit(1);
  const data = users.at(0);

  fastify.log.debug(`Login attempt data: ${JSON.stringify(data, null, 2)}`);

  if (!data) {
    throw new Unauthorized("Invalid email or password");
  }

  const {
    users: user,
    organizations: organization,
    organization_users: organizationUser,
  } = data;

  if (user.status === UserStatus.SUSPENDED) {
    throw new Unauthorized("User account is suspended");
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new Unauthorized("User account is inactive");
  }

  const isPasswordValid =
    userId !== undefined || (await bcrypt.compare(password, user.passwordHash));
  if (!isPasswordValid) {
    throw new Unauthorized("Invalid email or password");
  }

  return {
    organizationId: organization.id,
    user,
    role: organizationUser.role,
  };
}
