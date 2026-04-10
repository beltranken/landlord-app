import "dotenv/config";

import { initDb } from "../initDb";
import {
  propertiesTable,
  rentsTable,
  rentTenantsTable,
  tenantsTable,
  tenantFilesTable,
  usersTable,
} from "../schema";
import { RentFrequency, RentStatus } from "../types/enums";

const toISODate = (date: Date) => date.toISOString().slice(0, 10);

const seedRents = async () => {
  const { db, pool } = initDb();

  try {
    const existing = await db.select().from(rentsTable).limit(1);

    if (existing.length > 0) {
      console.log("Rents already exist; skipping seeding.");
      return;
    }

    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .limit(1);

    if (!user) {
      throw new Error(
        "No users found. Please seed users before seeding rents.",
      );
    }

    const properties = await db
      .select({
        id: propertiesTable.id,
        defaultRentAmount: propertiesTable.defaultRentAmount,
        defaultRentFrequency: propertiesTable.defaultRentFrequency,
      })
      .from(propertiesTable);

    if (properties.length === 0) {
      throw new Error(
        "No properties found. Please seed properties before seeding rents.",
      );
    }

    const tenants = await db
      .select({ id: tenantsTable.id })
      .from(tenantsTable);

    if (tenants.length === 0) {
      throw new Error(
        "No tenants found. Please seed tenants before seeding rents.",
      );
    }

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear() + 1, now.getMonth(), 0);

    const rents = properties.map((property) => ({
      propertyId: property.id,
      startDate: toISODate(startDate),
      endDate: toISODate(endDate),
      frequency:
        (property.defaultRentFrequency as RentFrequency | null) ??
        RentFrequency.MONTHLY,
      amount: property.defaultRentAmount,
      gracePeriodDays: 5,
      nextBillingDate: toISODate(startDate),
      status: RentStatus.ACTIVE,
      createdBy: user.id,
      updatedBy: user.id,
    }));

    const insertedRents = await db
      .insert(rentsTable)
      .values(rents)
      .returning({ id: rentsTable.id });

    const rentTenants = insertedRents.map((rent, index) => {
      const tenant = tenants[index % tenants.length];

      return {
        rentId: rent.id,
        tenantId: tenant.id,
        isPrimary: true,
        relationship: "primary tenant",
      };
    });

    if (rentTenants.length > 0) {
      await db.insert(rentTenantsTable).values(rentTenants);
    }

    const tenantFiles = tenants.map((tenant, index) => ({
      tenantId: tenant.id,
      image: null,
      name: `Lease Agreement ${index + 1}`,
      url: `https://example.com/tenant-files/lease-agreement-${tenant.id}.pdf`,
      description: "Seeded lease agreement document.",
      createdBy: user.id,
      updatedBy: user.id,
    }));

    if (tenantFiles.length > 0) {
      await db.insert(tenantFilesTable).values(tenantFiles);
    }

    console.log(
      `Seeded ${rents.length} rents, ${rentTenants.length} rent-tenant relationships, and ${tenantFiles.length} tenant files.`,
    );

    process.exit(0);
  } finally {
    await pool.end();
  }
};

seedRents().catch((error) => {
  console.error("Failed to seed rents", error);
  process.exit(1);
});
