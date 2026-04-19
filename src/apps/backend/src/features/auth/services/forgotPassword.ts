import postMarkClient from "@backend/libs/postMark";
import { and, eq, isNull } from "@db/drizzle";
import { usersTable } from "@db/schema";
import { ForgotPasswordRequest, UserStatus } from "@types";
import { FastifyInstance } from "fastify";
import { Conflict } from "http-errors";

export async function forgotPassword(
  fastify: FastifyInstance,
  param: ForgotPasswordRequest,
) {
  const [user] = await fastify.db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, param.email), isNull(usersTable.deletedAt)))
    .limit(1);

  if (!user || user.status === UserStatus.SUSPENDED) {
    throw new Conflict("User with this email does not exist");
  }

  const token = fastify.jwt.sign({ userId: user.id } as any, {
    expiresIn: "1d",
  });
  fastify.log.debug(`token: ${token}`);

  await postMarkClient.sendEmail({
    From: fastify.config.EMAIL_FROM,
    To: user.email,
    Subject: "Reset your password",
    TextBody: `We received a request to reset the password for your account. If you made this request, please reset your password by visiting the following link: ${token}\n\nIf you did not request a password reset, you can safely ignore this email.`,
  });
}
