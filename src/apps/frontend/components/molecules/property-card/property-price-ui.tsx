import { TextH3 } from "@/components/atoms/text";
import Text from "@/components/atoms/text/text-ui";
import { Sizes } from "@/constants";
import formatMoney from "@/utils/format-money";
import { StyleSheet, View } from "react-native";

export interface PropertyPriceProps {
  amount: number;
  frequency: string;
}

export default function PropertyPrice({
  amount,
  frequency,
}: Readonly<PropertyPriceProps>) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <TextH3 style={styles.amount}>
          {formatMoney(amount, { decimalPlaces: { min: 0, max: 0 } })}
        </TextH3>
        <Text
          style={styles.frequency}
        >{`/${frequency.slice(0, 2).toLowerCase()}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  badge: {
    backgroundColor: "#ffffffbb",
    paddingHorizontal: Sizes.padding * 0.75,
    paddingVertical: Sizes.padding * 0.25,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  amount: {
    color: "#001819",
    fontFamily: "Inter-Bold",
  },
  frequency: {
    color: "#414848",
  },
});
