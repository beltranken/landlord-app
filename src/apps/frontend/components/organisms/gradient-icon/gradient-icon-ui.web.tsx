import Colors from "@/constants/colors-old";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentProps } from "react";
import { View } from "react-native";
import MaskedView from "../masked-view/masked-view.web";

export default function GradientIcon({
  name,
  size = 24,
}: Readonly<{ size?: number; name: ComponentProps<typeof Ionicons>["name"] }>) {
  return (
    <MaskedView
      style={{ width: size, height: size }}
      maskElement={
        <View
          style={{
            backgroundColor: "transparent",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name={name} color="black" size={size} />
        </View>
      }
    >
      <LinearGradient
        colors={Colors.accentGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </MaskedView>
  );
}
