import { TextH2 } from "@/components/atoms/text";
import ImageView from "@/components/molecules/image-view/image-view";
import PropertyStatusUI from "@/components/molecules/property-status/property-status-ui";
import { Sizes } from "@/constants";
import { Property } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import PropertyAddressUI from "./property-address-ui";
import PropertyFeatures from "./property-features-ui";
import PropertyPrice from "./property-price-ui";

export interface PropertyCardProps {
  item: Property;
}

export default function PropertyCard({ item }: Readonly<PropertyCardProps>) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        router.push(`/properties/${item.id}`);
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.imageWrapper}>
          <ImageView
            source={
              item.image
                ? {
                    uri: item.image,
                  }
                : undefined
            }
            showLoading={!!item.image}
            fallbackContent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#e0e0e0",
                }}
              >
                <MaterialIcons
                  name="image-not-supported"
                  size={48}
                  color="white"
                />
              </View>
            }
          />

          <View style={styles.statusOverlay}>
            <PropertyStatusUI status={item.status} />
            <PropertyPrice
              amount={item.defaultRentAmount}
              frequency={item.defaultRentFrequency}
            />
          </View>
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.infoInner}>
            <TextH2>{item.name}</TextH2>
            <PropertyAddressUI property={item} />
          </View>

          {item.features && item.features.length > 0 && (
            <PropertyFeatures features={item.features.slice(0, 3)} />
          )}
        </View>
      </View>
      <View />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
  },
  imageWrapper: {
    width: "100%",
    height: 256,
  },
  statusOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: Sizes.padding * 1.5,
    borderRadius: 4,
    justifyContent: "space-between",
  },
  infoWrapper: {
    justifyContent: "space-between",
    padding: Sizes.padding * 1.5,
    gap: Sizes.padding,
  },
  infoInner: {
    gap: 4,
  },
});
