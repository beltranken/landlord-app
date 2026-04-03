import Text from "@/components/atoms/text/text-ui";
import formatAddress from "@/utils/format-address";
import { OptionalAddress } from "@/validations";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { StyleSheet, View } from "react-native";

export interface PropertyAddressProps {
  property?: OptionalAddress;
}

export default function PropertyAddressUI({
  property = {},
}: Readonly<PropertyAddressProps>) {
  return (
    <View style={styles.addressRow}>
      <EvilIcons name="location" size={16} color="black" />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressText}>
        {formatAddress(property)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressText: {
    flexShrink: 1,
  },
});
