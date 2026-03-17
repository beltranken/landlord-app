import Colors from "@/constants/colors-old";
import Sizes from "@/constants/sizes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import SectionWrapper from "../../atoms/section-wrapper/section-wrapper-ui";
import CalendarPicker from "../calendar-picker/calendar-picker-ui";

export default function MainHeader() {
  return (
    <SectionWrapper>
      <View style={styles.container}>
        <CalendarPicker />

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
