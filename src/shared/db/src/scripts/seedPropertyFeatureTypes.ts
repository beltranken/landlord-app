import "dotenv/config";
import { initDb } from "../initDb";
import { propertyFeatureTypesTable } from "../schema";
import { PropertyFeatureTypes } from "../types/enums";

const seedPropertyFeatureTypes = async () => {
  const { db, pool } = initDb();

  const featureTypes = [
    {
      name: "Floor area",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
      unit: "sqmt",
    },
    {
      name: "Bedroom",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
    },
    {
      name: "Bathroom",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
    },
    {
      name: "Kitchen",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
    },
    {
      name: "Parking",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
    },
    {
      name: "Garden",
      type: PropertyFeatureTypes.BOOLEAN,
      options: null,
    },
    {
      name: "Pets allowed",
      type: PropertyFeatureTypes.BOOLEAN,
      options: null,
    },
    {
      name: "Furnishing",
      type: PropertyFeatureTypes.OPTION,
      options: JSON.stringify([
        "unfurnished",
        "semi furnished",
        "fully furnished",
      ]),
    },
    {
      name: "Others",
      type: PropertyFeatureTypes.TEXT,
      options: null,
    },
  ];

  try {
    await db
      .insert(propertyFeatureTypesTable)
      .values(featureTypes)
      .onConflictDoNothing({ target: propertyFeatureTypesTable.name });
  } finally {
    await pool.end();
  }
};

seedPropertyFeatureTypes().catch((error) => {
  console.error("Failed to seed property feature types", error);
  process.exit(1);
});
