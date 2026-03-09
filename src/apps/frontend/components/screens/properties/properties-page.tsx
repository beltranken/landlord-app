import Text from "@/components/atoms/text/text-ui";
import MainHeader from "@/components/molecules/main-header/main-header-ui";
import MainWrapper from "@/components/molecules/main-wrapper/main-wrapper-ui";
import PropertyStatusUI from "@/components/molecules/property-status/property-status-ui";
import type { PropertyWithRelations } from "@shared/db";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

function mockProperty(
  partial: Partial<PropertyWithRelations>
): PropertyWithRelations {
  const now = new Date();
  return {
    id: 0,
    name: "Unnamed",
    description: null,
    addressLine1: null,
    addressLine2: null,
    city: "Valenzuela",
    state: "NCR",
    postalCode: null,
    country: "PH",
    typeId: 1,
    type: {
      id: 1,
      name: "Apartment",
      createdAt: now,
      description: "A residential unit in a building.",
    },
    ownerId: 1,
    createdAt: now,
    updatedAt: now,
    ...partial,
  } as PropertyWithRelations;
}

export default function PropertiesPage() {
  const router = useRouter();

  const data: PropertyWithRelations[] = [
    mockProperty({
      id: 1,
      name: "Greenwood Apartments - Unit 2B",
      status: "occupied",
    }),
    mockProperty({ id: 2, name: "Test 2", status: "vacant" }),
    mockProperty({ id: 3, name: "Test 3", status: "occupied" }),
    mockProperty({ id: 4, name: "Test 4", status: "vacant" }),
  ];

  return (
    <MainWrapper
      title="Properties"
      StickyHeader={<MainHeader />}
      data={data}
      renderItem={({ index, item }) => (
        <Pressable
          style={{ flexDirection: "row", justifyContent: "space-between" }}
          onPress={() => {
            router.push(`/properties/${item.id}`);
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", gap: 8 }}>
            <Image
              source={{ uri: `https://picsum.photos/200?random=${index + 1}` }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
            <View style={{ justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontWeight: "500" }}>{item.name}</Text>
                <Text>{item.city}</Text>
              </View>

              <PropertyStatusUI status={item.status} />
            </View>
          </View>
          <View />
        </Pressable>
      )}
    />
  );
}
