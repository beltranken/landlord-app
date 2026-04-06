import { Text } from "@/components/atoms/text";
import { Sizes } from "@/constants";
import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export interface FormGroupProps {
  label: string;
  style?: ViewStyle;
}

export default function FormGroup({
  label,
  children,
  style,
}: Readonly<PropsWithChildren<FormGroupProps>>) {
  return (
    <View style={[styles.formGroup, style]}>
      <Text style={styles.formGroupLabel}>{label}</Text>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    gap: Sizes.padding,
  },
  formGroupLabel: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
  },
});
