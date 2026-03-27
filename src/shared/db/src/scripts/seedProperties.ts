import { PropertyStatus, PropertyType, RentFrequency } from "@enums";
import "dotenv/config";
import { initDb } from "../initDb";
import { organizationsTable, propertiesTable, usersTable } from "../schema";

const seedProperties = async () => {
  const { db, pool } = initDb();

  try {
    const existing = await db.select().from(propertiesTable).limit(1);

    if (existing.length > 0) {
      console.log("Properties already exist; skipping seeding.");
      return;
    }

    const [organization] = await db
      .select({ id: organizationsTable.id })
      .from(organizationsTable)
      .limit(1);

    if (!organization) {
      throw new Error(
        "No organizations found. Please seed organizations before seeding properties.",
      );
    }

    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .limit(1);

    if (!user) {
      throw new Error(
        "No users found. Please seed users before seeding properties.",
      );
    }

    const properties = [
      {
        organizationId: organization.id,
        propertyStatus: PropertyStatus.AVAILABLE,
        name: "Downtown Apartment 101",
        type: PropertyType.APARTMENT,
        defaultRentFrequency: RentFrequency.MONTHLY,
        defaultRentAmount: 120000,
        address1: "123 Main St",
        city: "Sample City",
        state: "Sample State",
        postalCode: "12345",
        country: "Sample Country",
        latitude: null,
        longitude: null,
        createdBy: user.id,
        updatedBy: user.id,
      },
      {
        organizationId: organization.id,
        propertyStatus: PropertyStatus.AVAILABLE,
        name: "Suburban House",
        type: PropertyType.CONDO,
        defaultRentFrequency: RentFrequency.MONTHLY,
        defaultRentAmount: 250000,
        address1: "456 Oak Ave",
        city: "Sample City",
        state: "Sample State",
        postalCode: "67890",
        country: "Sample Country",
        latitude: null,
        longitude: null,
        createdBy: user.id,
        updatedBy: user.id,
      },
      {
        organizationId: organization.id,
        propertyStatus: PropertyStatus.UNDER_MAINTENANCE,
        name: "Room 12B",
        type: PropertyType.ROOM,
        defaultRentFrequency: RentFrequency.MONTHLY,
        defaultRentAmount: 80000,
        address1: "789 Pine Rd",
        city: "Sample City",
        state: "Sample State",
        postalCode: "24680",
        country: "Sample Country",
        latitude: null,
        longitude: null,
        createdBy: user.id,
        updatedBy: user.id,
      },
    ];

    await db.insert(propertiesTable).values(properties);

    console.log(`Seeded ${properties.length} properties.`);
  } finally {
    await pool.end();
  }
};

seedProperties().catch((error) => {
  console.error("Failed to seed properties", error);
  process.exit(1);
});
