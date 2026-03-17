import Colors from "@/constants/colors-old";
import { StyleSheet, Text, TextProps } from "react-native";

export default function TextH6({ style, ...props }: Readonly<TextProps>) {
  return <Text style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
