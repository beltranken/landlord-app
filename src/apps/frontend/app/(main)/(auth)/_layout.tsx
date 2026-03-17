import { logo } from "@/assets/images";
import { Colors } from "@/constants";
import { Image } from "expo-image";
import { Slot } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AuthLayout() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.contentContainer}>
        <Slot />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.invertedBackground,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  contentContainer: {
    paddingVertical: 48,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    gap: 32,
  },
});
