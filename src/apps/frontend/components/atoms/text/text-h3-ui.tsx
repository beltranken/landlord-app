import { Colors } from "@/constants";
import { StyleSheet, Text, TextProps } from "react-native";

export default function TextH3({ style, ...props }: Readonly<TextProps>) {
  return <Text style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: Colors.textTitle,
  },
});
