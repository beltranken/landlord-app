import "dotenv/config";
import { initDb } from "../initDb";
import {
  organizationsTable,
  propertiesTable,
  propertyFeaturesTable,
  propertyFeatureTypesTable,
  usersTable,
} from "../schema";
import { PropertyStatus, PropertyType, RentFrequency } from "../types/enums";

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

    const insertedProperties = await db
      .insert(propertiesTable)
      .values(properties)
      .returning({ id: propertiesTable.id, name: propertiesTable.name });

    const featureTypes = await db
      .select({
        id: propertyFeatureTypesTable.id,
        name: propertyFeatureTypesTable.name,
      })
      .from(propertyFeatureTypesTable);

    const getFeatureTypeId = (featureName: string) => {
      const featureType = featureTypes.find((ft) => ft.name === featureName);

      if (!featureType) {
        throw new Error(
          `Feature type "${featureName}" not found. Please seed property feature types before seeding properties.`,
        );
      }

      return featureType.id;
    };

    const propertyFeatures = insertedProperties.flatMap((property) => {
      const featuresForProperty: { featureName: string; value: string }[] = [];

      switch (property.name) {
        case "Downtown Apartment 101":
          featuresForProperty.push(
            { featureName: "Bedroom", value: "2" },
            { featureName: "Bathroom", value: "1" },
            { featureName: "Parking spot", value: "1" },
          );
          break;
        case "Suburban House":
          featuresForProperty.push(
            { featureName: "Bedroom", value: "3" },
            { featureName: "Bathroom", value: "2" },
            { featureName: "Parking spot", value: "2" },
          );
          break;
        case "Room 12B":
          featuresForProperty.push(
            { featureName: "Bedroom", value: "1" },
            { featureName: "Bathroom", value: "1" },
          );
          break;
        default:
          break;
      }

      return featuresForProperty.map(({ featureName, value }) => ({
        propertyId: property.id,
        propertyFeatureTypeId: getFeatureTypeId(featureName),
        name: featureName,
        value,
        createdBy: user.id,
        updatedBy: user.id,
      }));
    });

    if (propertyFeatures.length > 0) {
      await db.insert(propertyFeaturesTable).values(propertyFeatures);
    }

    console.log(
      `Seeded ${properties.length} properties and ${propertyFeatures.length} property features.`,
    );

    process.exit(0);
  } finally {
    await pool.end();
  }
};

seedProperties().catch((error) => {
  console.error("Failed to seed properties", error);
  process.exit(1);
});
