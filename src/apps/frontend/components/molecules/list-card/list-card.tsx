import { Colors, Sizes } from "@/constants";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export type ListCardProps = {
  containerStyle?: View["props"]["style"];
};
export default function ListCard({
  children,
  containerStyle,
}: Readonly<PropsWithChildren<ListCardProps>>) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: "100%",
    backgroundColor: Colors.white,
    overflow: "hidden",
    borderRadius: Sizes.borderRadius,
  },
});
