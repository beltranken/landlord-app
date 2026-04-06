import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

export type GradientIconProps = {
  size?: number;
  name: ComponentProps<typeof Ionicons>["name"];
  isFocused?: boolean;
};
