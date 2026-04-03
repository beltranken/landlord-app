import { Text } from "@/components/atoms/text";
import { Sizes } from "@/constants";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export interface FormGroupProps {
  label: string;
  children: ReactNode;
}

export default function FormGroup({
  label,
  children,
}: Readonly<FormGroupProps>) {
  return (
    <View style={styles.formGroup}>
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
