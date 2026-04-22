import { BaseStyles, Colors, Sizes } from "@/constants";
import { useMemo } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import Text from "../text/text-ui";

type ButtonProps = PressableProps & {
  containerStyle?: ViewProps["style"];
  textStyles?: TextProps["style"];
  disabledStyles?: StyleProp<ViewStyle>;
};

function Button({
  containerStyle,
  textStyles,
  children,
  style,
  disabledStyles = {},
  disabled,
  ...props
}: Readonly<ButtonProps>) {
  const typeOfChild = typeof children;

  let content;

  switch (typeOfChild) {
    case "string":
    case "number":
    case "boolean":
    case "bigint":
      content = (
        <Text style={[styles.text, textStyles]}>{String(children)}</Text>
      );
      break;
    default:
      content = children;
  }

  const pressableStyle: PressableProps["style"] = useMemo(() => {
    if (typeof style === "function") {
      return (state) => [
        styles.buttonContainer,
        style(state),
        disabled && styles.disabled,
        disabled && disabledStyles,
      ];
    }

    return [
      styles.buttonContainer,
      style,
      disabled && styles.disabled,
      disabled && disabledStyles,
    ];
  }, [style, disabled, disabledStyles]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable style={pressableStyle} {...props}>
        {content}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  buttonContainer: {
    backgroundColor: Colors.button,
    padding: Sizes.padding,
    borderRadius: 5,
    alignItems: "center",
    ...BaseStyles.shadow,
  },
  text: {
    fontFamily: "Inter-Bold",
    color: Colors.buttonText,
  },
  disabled: {
    backgroundColor: Colors.buttonDisabled,
  },
});

export default Button;
