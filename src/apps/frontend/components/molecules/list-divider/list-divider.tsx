import { Colors, Sizes } from "@/constants";
import { StyleSheet, View } from "react-native";

export default function ListDivider() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: Sizes.maxWidth,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  line: {
    height: 2,
    width: "100%",
    backgroundColor: "#EFE9E4",
    borderRadius: 100,
    overflow: "hidden",
  },
});
