import TextH2 from "@/components/atoms/text/text-h2-ui";
import { BaseStyles, Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function CustomTabLayout({
  children,
  title,
  name,
}: Readonly<PropsWithChildren<{ title: string; name: string }>>) {
  const router = useRouter();

  const isInner = name.includes("[id]") || name.includes("add");

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <View style={styles.backBtnContainer}>
            {isInner && (
              <Pressable style={styles.backBtn}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={Colors.button}
                  onPress={handleBackPress}
                />
              </Pressable>
            )}

            <TextH2>{title}</TextH2>
          </View>

          {!isInner && (
            <View style={styles.btnContainer}>
              <Pressable
                style={styles.actionBtn}
                onPress={() => {
                  router.push("/");
                }}
              >
                <Ionicons
                  name="person-outline"
                  color={Colors.button}
                  size={24}
                />
              </Pressable>

              <Pressable
                style={styles.actionBtn}
                onPress={() => {
                  router.push("/");
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  color={Colors.button}
                  size={24}
                />
              </Pressable>
            </View>
          )}
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: Sizes.padding,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Sizes.padding / 2,
    maxWidth: Sizes.maxWidth,
    width: "100%",
  },
  btnContainer: {
    flexDirection: "row",
    gap: Sizes.padding * 0.5,
  },
  backBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    borderRadius: 100,
    padding: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.neutral,
    ...BaseStyles.shadow,
  },
  backBtn: {
    borderRadius: 100,
    padding: 8,
    backgroundColor: "transparent",
  },
});
