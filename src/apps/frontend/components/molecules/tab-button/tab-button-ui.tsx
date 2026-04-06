import GradientIcon from "@/components/organisms/gradient-icon/gradient-icon-ui";
import Colors from "@/constants/colors-old";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TabTriggerSlotProps } from "expo-router/ui";
import { ComponentProps, Ref } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
export type Icon = ComponentProps<typeof Ionicons>["name"];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
  ref?: Ref<View>;
};

export default function TabButton({
  icon = "grid",
  children,
  isFocused,
  ...props
}: Readonly<TabButtonProps>) {
  const iconName = `${icon}-outline` as Icon;

  return (
    <View style={styles.tabButtonWrapper}>
      <Pressable {...props} style={styles.tabButton}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name={iconName} color={Colors.surface} size={24} />
        </View>

        <View style={{ opacity: isFocused ? 1 : 0 }}>
          <GradientIcon name={icon} isFocused={isFocused} />
        </View>

        <Text
          style={[
            styles.tabButtonText,
            isFocused ? { fontWeight: "bold" } : undefined,
          ]}
        >
          {children}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  tabButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 4,
    padding: 12,
    borderRadius: 100,
    overflow: "hidden",
    width: 48,
    height: 48,
  },
  tabButtonText: {
    fontSize: 12,
    color: "white",
    display: "none",
  },
});
