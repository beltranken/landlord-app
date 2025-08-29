import Colors from "@/constants/colors";
import { StyleSheet, Text, TextProps } from "react-native";

export default function TextH3({ style, ...props }: Readonly<TextProps>) {
  return <Text style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
