import Colors from "@/constants/colors";
import Sizes from "@/constants/sizes";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import SectionWrapper from "../../atoms/section-wrapper/section-wrapper-ui";

export default function HomeHeader() {
  return (
    <SectionWrapper>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Pressable style={styles.headerImgBtn}>
            <Image
              source={{ uri: "https://picsum.photos/id/550/128/128" }}
              style={styles.headerImg}
            />

            <View style={styles.headerIcon}>
              <Entypo name="chevron-small-up" size={8} color="black" />
              <Entypo name="chevron-small-down" size={8} color="black" />
            </View>
          </Pressable>

          <View style={{}}>
            <Text style={{ fontSize: 16, fontWeight: "medium" }}>Hey! Ken</Text>
            <Text style={{ fontSize: 14, color: Colors.gray }}>
              beltrankenhenson@gmail.com
            </Text>
          </View>
        </View>

        <Pressable style={styles.notifBtn}>
          <Ionicons
            name="notifications-outline"
            color={Colors.textPrimary}
            size={24}
          />
        </Pressable>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  leftContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  headerImgBtn: {
    height: 36,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: Colors.white,
    padding: 4,
    gap: 8,
    flexDirection: "row",
  },
  headerIcon: { gap: 1, paddingHorizontal: 4, justifyContent: "center" },
  headerImg: {
    width: 30,
    height: "100%",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neutrals[600],
  },
  headerTextWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  notifBtn: {
    borderRadius: 100,
    padding: 12,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Sizes.padding,
  },
});
