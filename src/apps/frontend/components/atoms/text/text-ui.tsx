import Colors from "@/constants/colors";
import { StyleSheet, Text as BaseText, TextProps } from "react-native";

export default function Text({ style, ...props }: Readonly<TextProps>) {
  return <BaseText style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
});
