import { Text } from "@/components/atoms/text";
import { Sizes } from "@/constants";
import { PropertyFeature } from "@/types";
import { StyleSheet, View } from "react-native";

export interface PropertyFeaturesProps {
  features: PropertyFeature[];
}

export default function PropertyFeatures({
  features,
}: Readonly<PropertyFeaturesProps>) {
  if (!features || features.length === 0) return null;

  return (
    <>
      <View style={styles.divider} />

      <View style={styles.featuresRow}>
        {Array.from({ length: 3 }).map((_, index) => {
          const { featureType, ...feature } = features[index] ?? {};

          if (!feature?.id) {
            return <View key={index} style={styles.featureChip} />;
          }

          return (
            <View key={feature.id} style={styles.featureChip}>
              <Text style={styles.featureText}>
                {`${feature.value} ${featureType?.unit ? featureType.unit : feature.name}`}
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: "#C1C8C7",
    height: 1,
  },
  featuresRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: Sizes.padding / 2,
  },
  featureChip: {
    flex: 1,
  },
  featureText: {
    fontFamily: "Inter-Medium",
  },
});
