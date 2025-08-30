import { Pressable, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Text from "@/components/atoms/text/text-ui";
import Colors from "@/constants/colors";

export default function CalendarPicker() {
  const valueStr = "Sun, 11 may 25";

  return (
    <Pressable style={styles.container}>
      <AntDesign name="calendar" size={16} color={Colors.textPrimary} />

      <Text>{valueStr}</Text>

      <AntDesign name="down" size={12} color={Colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 100,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
