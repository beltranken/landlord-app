import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

type DividerProps = {
  label: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

export function Divider({ label, style, labelStyle }: DividerProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  label: {
    marginHorizontal: 8,
    color: "#888",
  },
});
