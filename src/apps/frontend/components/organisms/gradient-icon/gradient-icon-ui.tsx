import { Colors } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { GradientIconProps } from "./gradient-type";

export default function GradientIcon({
  name,
  size = 24,
  isFocused,
}: Readonly<GradientIconProps>) {
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
          <Ionicons name={name} color={Colors.surface} size={size} />
        </View>
      }
    >
      <LinearGradient
        colors={isFocused ? Colors.accentGradient : ["white", "white"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </MaskedView>
  );
}
