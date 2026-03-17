import { Colors } from "@/constants";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  TextProps,
  View,
  ViewProps,
} from "react-native";
import Text from "../text/text-ui";

type ButtonProps = PressableProps & {
  containerStyle?: ViewProps["style"];
  textStyles?: TextProps["style"];
};

export function Button({
  containerStyle,
  textStyles,
  children,
  style,
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

  const pressableStyle: PressableProps["style"] =
    typeof style === "function"
      ? (state) => [styles.buttonContainer, style(state)]
      : [styles.buttonContainer, style];

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
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    color: Colors.buttonText,
  },
});
