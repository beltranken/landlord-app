import { StyleSheet } from "react-native";
import Sizes from "./sizes";

const baseStyles = StyleSheet.create({
  shadow: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.12)",
  },
  wrapper: {
    paddingHorizontal: Sizes.padding,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    gap: Sizes.padding * 2,
    maxWidth: Sizes.maxWidth,
  },
});

export default baseStyles;
