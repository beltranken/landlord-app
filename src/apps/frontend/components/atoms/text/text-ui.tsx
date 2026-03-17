import { Colors } from "@/constants";
import { Text as BaseText, StyleSheet, TextProps } from "react-native";

export default function Text({ style, ...props }: Readonly<TextProps>) {
  return <BaseText style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: Colors.text,
  },
});
