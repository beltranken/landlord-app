import { Text } from "@/components/atoms/text";
import { Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface ListEmptyProps {
  message?: string;
}

export default function ListEmpty({
  message = "No items available",
}: Readonly<ListEmptyProps>) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="inbox" size={48} color={Colors.secondary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.padding * 4,
    gap: 12,
  },
  text: {
    color: Colors.secondary,
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
});
