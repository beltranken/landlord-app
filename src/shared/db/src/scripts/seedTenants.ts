import { faker } from "@faker-js/faker";
import "dotenv/config";

import { initDb } from "../initDb";
import {
  organizationsTable,
  tenantFilesTable,
  tenantsTable,
  usersTable,
} from "../schema";

const seedTenants = async () => {
  const { db, pool } = initDb();

  try {
    const existing = await db.select().from(tenantsTable).limit(1);

    if (existing.length > 0) {
      console.log("Tenants already exist; skipping seeding.");
      return;
    }

    const [organization] = await db
      .select({ id: organizationsTable.id })
      .from(organizationsTable)
      .limit(1);

    if (!organization) {
      throw new Error(
        "No organizations found. Please seed organizations before seeding tenants.",
      );
    }

    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .limit(1);

    if (!user) {
      throw new Error(
        "No users found. Please seed users before seeding tenants.",
      );
    }

    const TENANT_COUNT = 10;

    const PHILIPPINE_LOCATIONS = [
      { city: "Quezon City", state: "Metro Manila" },
      { city: "Manila", state: "Metro Manila" },
      { city: "Makati", state: "Metro Manila" },
      { city: "Cebu City", state: "Cebu" },
      { city: "Davao City", state: "Davao del Sur" },
      { city: "Iloilo City", state: "Iloilo" },
      { city: "Baguio", state: "Benguet" },
    ];

    const tenants = Array.from({ length: TENANT_COUNT }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const { city, state } = faker.helpers.arrayElement(PHILIPPINE_LOCATIONS);
      const country = "Philippines";
      const birthDate = faker.date
        .birthdate({ min: 18, max: 70, mode: "age" })
        .toISOString()
        .slice(0, 10); // YYYY-MM-DD for drizzle `date` column

      return {
        organizationId: organization.id,
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number({ style: "international" }),
        dateOfBirth: birthDate,
        address1: faker.location.streetAddress({ useFullAddress: true }),
        address2: null,
        city,
        state,
        postalCode: faker.location.zipCode(),
        country,
        latitude: null,
        longitude: null,
        userId: null,
        createdBy: user.id,
        updatedBy: user.id,
      };
    });

    const insertedTenants = await db
      .insert(tenantsTable)
      .values(tenants)
      .returning({
        id: tenantsTable.id,
        firstName: tenantsTable.firstName,
        lastName: tenantsTable.lastName,
      });

    const tenantFiles = insertedTenants.map((tenant, index) => ({
      tenantId: tenant.id,
      image: null,
      name: `Tenant ID ${tenant.id} profile document ${index + 1}`,
      url: `https://example.com/tenant-files/tenant-${tenant.id}-profile.pdf`,
      description: `Seeded profile document for ${tenant.firstName} ${tenant.lastName}.`,
      createdBy: user.id,
      updatedBy: user.id,
    }));

    if (tenantFiles.length > 0) {
      await db.insert(tenantFilesTable).values(tenantFiles);
    }

    console.log(
      `Seeded ${tenants.length} tenants and ${tenantFiles.length} tenant files.`,
    );

    process.exit(0);
  } finally {
    await pool.end();
  }
};

seedTenants().catch((error) => {
  console.error("Failed to seed tenants", error);
  process.exit(1);
});
