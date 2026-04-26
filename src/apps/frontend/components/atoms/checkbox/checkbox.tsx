import { Text } from "@/components/atoms/text";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

interface CheckboxProps {
  checked: boolean;
  label: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  iconSize?: number;
}

export default function Checkbox({
  checked,
  label,
  onPress,
  containerStyle,
  iconSize = 18,
}: Readonly<CheckboxProps>) {
  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Ionicons
        name={checked ? "checkbox" : "square-outline"}
        size={iconSize}
        color={Colors.primary}
      />

      <Text>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
