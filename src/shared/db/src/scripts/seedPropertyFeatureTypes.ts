import { PropertyFeatureTypes } from "@enums";
import "dotenv/config";
import { initDb } from "../initDb";
import { propertyFeatureTypesTable } from "../schema";

const seedPropertyFeatureTypes = async () => {
  const { db, pool } = initDb();

  const featureTypes = [
    {
      name: "Bedrooms",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
    },
    {
      name: "Bathrooms",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
    },
    {
      name: "Parking spots",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
    },
    {
      name: "Floor area (sqft)",
      type: PropertyFeatureTypes.NUMBER,
      options: null,
    },
    {
      name: "Balcony",
      type: PropertyFeatureTypes.BOOLEAN,
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
        "part furnished",
        "fully furnished",
      ]),
    },
    {
      name: "Appliances included",
      type: PropertyFeatureTypes.OPTION,
      options: JSON.stringify([
        "fridge",
        "stove",
        "oven",
        "dishwasher",
        "washer",
        "dryer",
        "microwave",
      ]),
    },
    {
      name: "Heating type",
      type: PropertyFeatureTypes.OPTION,
      options: JSON.stringify([
        "none",
        "electric",
        "gas",
        "central",
        "radiator",
        "underfloor",
      ]),
    },
    {
      name: "Cooling type",
      type: PropertyFeatureTypes.OPTION,
      options: JSON.stringify([
        "none",
        "ac unit",
        "central ac",
        "evaporative cooling",
      ]),
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
