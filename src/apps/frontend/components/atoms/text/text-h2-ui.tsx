import Colors from "@/constants/colors-old";
import { StyleSheet, Text, TextProps } from "react-native";

export default function TextH2({ style, ...props }: Readonly<TextProps>) {
  return <Text style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
});
