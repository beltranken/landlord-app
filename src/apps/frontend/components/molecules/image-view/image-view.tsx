import { Image, ImageProps } from "expo-image";
import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export interface ImageViewProps extends ImageProps {
  containerStyle?: ViewStyle;
}

export default function ImageView({
  containerStyle,
  ...imageProps
}: Readonly<PropsWithChildren<ImageViewProps>>) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image style={styles.image} {...imageProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
});
