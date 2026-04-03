import "dotenv/config";

import { initDb } from "../initDb";
import {
  organizationsTable,
  organizationUsersTable,
  usersTable,
} from "../schema";
import { UserRole, UserStatus } from "../types/enums";

const seedOrganizationAndUser = async () => {
  const { db, pool } = initDb();

  try {
    const existingOrgUser = await db
      .select({ id: organizationUsersTable.id })
      .from(organizationUsersTable)
      .limit(1);

    if (existingOrgUser.length > 0) {
      console.log(
        "Organization and user mapping already exists; skipping seeding.",
      );
      return;
    }

    let [organization] = await db
      .select({ id: organizationsTable.id })
      .from(organizationsTable)
      .limit(1);

    if (!organization) {
      const insertedOrgs = await db
        .insert(organizationsTable)
        .values({
          name: "Default Organization",
        })
        .returning({ id: organizationsTable.id });

      organization = insertedOrgs[0];
      console.log("Created default organization.");
    }

    let [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .limit(1);

    if (!user) {
      const defaultEmail = "owner@example.com";
      const defaultPassword = "Password123!";

      // bcrypt hash for the default password above with salt rounds = 10
      // Generated once and stored here so this script can run without bcrypt as a dependency.
      const passwordHash =
        "$2b$10$wZ0pM8Xv3EoFZpDqW9CNkeuAwhLz6Hy1SLKQhiWbtjL9L1koXSPK6";

      const insertedUsers = await db
        .insert(usersTable)
        .values({
          email: defaultEmail,
          passwordHash,
          firstName: "Default",
          lastName: "Owner",
          status: UserStatus.ACTIVE,
        })
        .returning({ id: usersTable.id });

      user = insertedUsers[0];
      console.log(
        `Created default user with email "${defaultEmail}" and password "${defaultPassword}".
DO NOT use this account in production.`,
      );
    }

    await db.insert(organizationUsersTable).values({
      organizationId: organization.id,
      userId: user.id,
      role: UserRole.ADMIN,
      isDisabled: false,
    });

    console.log("Seeded organization, user, and organization-user mapping.");
    process.exit(0);
  } finally {
    await pool.end();
  }
};

seedOrganizationAndUser().catch((error) => {
  console.error("Failed to seed organization and user", error);
  process.exit(1);
});
