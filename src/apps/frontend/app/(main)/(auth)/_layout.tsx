import { logo } from "@/assets/images";
import { TextH1 } from "@/components/atoms/text";
import { Colors, Sizes, Vars } from "@/constants";
import { Image } from "expo-image";
import { Slot } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AuthLayout() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      stickyHeaderIndices={[0]}
    >
      <View style={styles.wrapper}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />

          <TextH1>{Vars.appName}</TextH1>
        </View>
      </View>

      <View style={styles.wrapper}>
        <View style={styles.contentContainer}>
          <View style={styles.contentInner}>
            <Slot />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    padding: Sizes.padding,
    backgroundColor: Colors.background,
    maxWidth: Sizes.maxWidth,
    width: "100%",
  },
  logo: {
    width: 64,
    height: 64,
  },
  contentContainer: {
    paddingVertical: 48,
    paddingHorizontal: Sizes.padding,
    flex: 1,
    maxWidth: Sizes.maxWidth,
    width: "100%",
  },
  contentInner: {
    borderRadius: 16,
    padding: Sizes.padding * 2,
    backgroundColor: Colors.white,
    gap: Sizes.padding * 2.5,
  },
});
