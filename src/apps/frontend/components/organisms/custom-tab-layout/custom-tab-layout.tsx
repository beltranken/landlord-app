import TextH2 from "@/components/atoms/text/text-h2-ui";
import { Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function CustomTabLayout({
  children,
  title,
}: Readonly<PropsWithChildren<{ title: string }>>) {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <View>
            <TextH2 style={styles.titleText}>{title}</TextH2>
          </View>

          <View>
            <Pressable style={styles.notifBtn}>
              <Ionicons
                name="notifications-outline"
                color={Colors.button}
                size={24}
              />
            </Pressable>
          </View>
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
    width: "auto",
  },
  notifBtn: {
    borderRadius: 100,
    padding: 8,
    backgroundColor: "white",
  },
  titleText: {},
});
