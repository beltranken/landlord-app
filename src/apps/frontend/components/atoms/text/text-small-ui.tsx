import Colors from "@/constants/colors-old";
import { Text as BaseText, StyleSheet, TextProps } from "react-native";

export default function TextSmall({ style, ...props }: Readonly<TextProps>) {
  return <BaseText style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
});
