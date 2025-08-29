import baseStyles from "@/constants/styles";
import { PropsWithChildren } from "react";
import {
  ImageBackground,
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

interface CardProps extends Omit<PressableProps, "style"> {
  style?: StyleProp<ViewStyle>;
  backgroundImageSource?: ImageBackground["props"]["source"];
}

export default function Card({
  children,
  style,
  backgroundImageSource,
  ...props
}: Readonly<PropsWithChildren<CardProps>>) {
  return (
    <Pressable style={[styles.wrapper, baseStyles.shadow, style]} {...props}>
      <ImageBackground source={backgroundImageSource} style={styles.inner}>
        {children}
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 24,
  },
  inner: {
    padding: 20,
  },
});
