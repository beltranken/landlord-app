import { Text } from "@/components/atoms/text";
import { Colors, Sizes } from "@/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

export interface NumberStepperProps {
  value?: number;
  onChange?: (value: number) => void;
  step?: number;
  disabled?: boolean;
}

export default function NumberStepper({
  value = 0,
  onChange,
  step = 1,
  disabled = false,
}: Readonly<NumberStepperProps>) {
  const handleChange = (delta: number) => {
    if (disabled) return;
    const next = (Number.isFinite(value) ? value : 0) + delta;
    onChange?.(next);
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => handleChange(-step)}
        disabled={disabled}
      >
        <MaterialCommunityIcons name="minus" size={16} color={Colors.white} />
      </Pressable>

      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>
          {Number.isFinite(value) ? value : 0}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => handleChange(step)}
        disabled={disabled}
      >
        <MaterialCommunityIcons name="plus" size={16} color={Colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    width: "auto",
    padding: Sizes.padding / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: Colors.button,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: Colors.text,
  },
  valueContainer: {
    minWidth: 48,
    paddingHorizontal: Sizes.padding,
    paddingVertical: Sizes.padding / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: Colors.text,
  },
});
