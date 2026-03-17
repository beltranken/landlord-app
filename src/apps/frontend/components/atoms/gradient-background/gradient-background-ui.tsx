import Colors from "@/constants/colors-old";
import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";

export default function GradientBackground({
  children,
  style,
}: Readonly<PropsWithChildren<{ style?: StyleProp<ViewStyle> }>>) {
  return (
    <LinearGradient
      colors={Colors.surfaceGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
}
