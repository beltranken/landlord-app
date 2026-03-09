import { FastifyInstance } from "fastify";
import { usersTable } from "@db/schema";
import { eq } from "@db/drizzle";
import bcrypt from "bcrypt";
import { UserStatus } from "@db/enums";
import { Unauthorized } from "http-errors";

export async function login(
  fastify: FastifyInstance,
  email: string,
  password: string,
) {
  const users = await fastify.db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  const user = users.at(0);

  if (!user) {
    throw new Unauthorized("Invalid email or password");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new Unauthorized("User account is suspended");
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new Unauthorized("User account is inactive");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Unauthorized("Invalid email or password");
  }

  const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: "1h" });

  return { token };
}
