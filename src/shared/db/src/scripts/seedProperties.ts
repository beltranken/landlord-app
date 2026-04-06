import { faker } from "@faker-js/faker";
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

    const PROPERTY_COUNT = 10;

    const PHILIPPINE_LOCATIONS = [
      { city: "Quezon City", state: "Metro Manila" },
      { city: "Manila", state: "Metro Manila" },
      { city: "Makati", state: "Metro Manila" },
      { city: "Cebu City", state: "Cebu" },
      { city: "Davao City", state: "Davao del Sur" },
      { city: "Iloilo City", state: "Iloilo" },
      { city: "Baguio", state: "Benguet" },
    ];

    const properties = Array.from({ length: PROPERTY_COUNT }, (_, index) => {
      const type = faker.helpers.arrayElement([
        PropertyType.APARTMENT,
        PropertyType.CONDO,
        PropertyType.ROOM,
        PropertyType.COMPLEX,
      ]);

      const { city, state } = faker.helpers.arrayElement(PHILIPPINE_LOCATIONS);
      const country = "Philippines";

      return {
        organizationId: organization.id,
        status: PropertyStatus.AVAILABLE,
        name: `${city} ${type} ${index + 1}`,
        type,
        defaultRentFrequency: RentFrequency.MONTHLY,
        defaultRentAmount: faker.number.int({ min: 80000, max: 300000 }),
        address1: faker.location.streetAddress(true),
        city,
        state,
        postalCode: faker.location.zipCode(),
        country,
        latitude: null,
        longitude: null,
        createdBy: user.id,
        updatedBy: user.id,
      };
    });

    const insertedProperties = await db
      .insert(propertiesTable)
      .values(properties)
      .returning({
        id: propertiesTable.id,
        type: propertiesTable.type,
      });

    const featureTypes = await db
      .select({
        id: propertyFeatureTypesTable.id,
        name: propertyFeatureTypesTable.name,
      })
      .from(propertyFeatureTypesTable);

    console.log(
      `Fetched ${JSON.stringify(featureTypes, null, 2)} property feature types for seeding property features.`,
    );

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

      switch (property.type) {
        case PropertyType.APARTMENT:
        case PropertyType.CONDO:
        case PropertyType.COMPLEX:
          featuresForProperty.push(
            {
              featureName: "Floor area",
              value: String(faker.number.int({ min: 20, max: 100 })),
            },
            {
              featureName: "Bedroom",
              value: String(faker.number.int({ min: 1, max: 4 })),
            },
            {
              featureName: "Bathroom",
              value: String(faker.number.int({ min: 1, max: 3 })),
            },
            {
              featureName: "Parking",
              value: String(faker.number.int({ min: 0, max: 3 })),
            },
          );
          break;
        case PropertyType.ROOM:
          featuresForProperty.push(
            { featureName: "Bedroom", value: "1" },
            {
              featureName: "Bathroom",
              value: String(faker.number.int({ min: 1, max: 2 })),
            },
          );
          break;
        default:
          break;
      }

      return featuresForProperty.map(({ featureName, value }) => ({
        propertyId: property.id,
        propertyFeatureTypeId: getFeatureTypeId(featureName),
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
