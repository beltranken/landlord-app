import postMarkClient from "@backend/libs/postMark";
import { and, eq, isNull } from "@db/drizzle";
import {
  organizationsTable,
  organizationUsersTable,
  usersTable,
} from "@db/schema";
import { RegisterRequest, UserStatus } from "@types";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { Conflict } from "http-errors";

export async function register(
  fastify: FastifyInstance,
  data: RegisterRequest,
) {
  const existingUsers = await fastify.db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, data.email), isNull(usersTable.deletedAt)))
    .limit(1);

  if (existingUsers.length > 0) {
    throw new Conflict("Email is already in use");
  }

  let organizationId: number | undefined;

  if (data.organizationId) {
    const organizations = await fastify.db
      .select()
      .from(organizationsTable)
      .where(
        and(
          eq(organizationsTable.id, data.organizationId),
          isNull(organizationsTable.deletedAt),
        ),
      )
      .limit(1);

    organizationId = organizations.at(0)?.id;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  let dateOfBirth: Date | undefined;

  if (data.dateOfBirth) {
    dateOfBirth = new Date(data.dateOfBirth);
  }

  await fastify.db.transaction(async (tx) => {
    if (!organizationId) {
      const result = await tx
        .insert(organizationsTable)
        .values({
          name: `${data.firstName} ${data.lastName}'s Organization`,
        })
        .returning({ id: organizationsTable.id });

      organizationId = result.at(0)?.id;
    }

    const result = await tx
      .insert(usersTable)
      .values({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: hashedPassword,
        phone: data.phone,
        dateOfBirth,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        status: fastify.config.VERIFY_EMAIL
          ? UserStatus.INACTIVE
          : UserStatus.ACTIVE,
      })
      .returning({ id: usersTable.id });

    const userId = result.at(0)?.id;

    if (!userId || !organizationId) {
      throw new Conflict("Failed to create user or organization");
    }

    await tx.insert(organizationUsersTable).values({
      organizationId,
      userId,
    });

    const token = fastify.jwt.sign({ userId, organizationId });
    fastify.log.debug(`token: ${token}`);

    await postMarkClient.sendEmail({
      From: fastify.config.EMAIL_FROM,
      To: data.email,
      Subject: "Verify your email",
      TextBody: `Please verify your email by clicking the following link: ${token}`,
    });
  });
}
