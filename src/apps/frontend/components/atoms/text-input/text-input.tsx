import { BaseStyles, Colors, Sizes } from "@/constants";
import { EvilIcons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import type {
  TextInput as RNTextInput,
  TextProps,
  ViewProps,
} from "react-native";
import {
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  TextInput as TextInputBase,
  View,
} from "react-native";

export type TextInputProps = RNTextInputProps & {
  label?: string;
  labelStyle?: TextProps["style"];
  wrapperStyle?: ViewProps["style"];
  containerStyle?: ViewProps["style"];
  leftIconName?: React.ComponentProps<typeof EvilIcons>["name"];
  rightIcon?: React.ReactNode | React.ComponentProps<typeof EvilIcons>["name"];
  errorText?: string;
};

export const TextInput = forwardRef<RNTextInput, Readonly<TextInputProps>>(
  (props, ref) => {
    const {
      label,
      placeholder,
      leftIconName,
      rightIcon,
      errorText,
      style,
      onFocus,
      onBlur,
      value,
      labelStyle,
      containerStyle,
      wrapperStyle,
      ...rest
    } = props;

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus: TextInputProps["onFocus"] = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur: TextInputProps["onBlur"] = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        {label && (
          <Text
            style={[styles.label, labelStyle, errorText && styles.inputError]}
          >
            {label}
          </Text>
        )}

        <View style={[styles.container, containerStyle, BaseStyles.shadow]}>
          {leftIconName && (
            <EvilIcons
              name={leftIconName}
              size={20}
              color="#000"
              style={styles.leftIcon}
            />
          )}

          <TextInputBase
            ref={ref}
            {...rest}
            value={value}
            style={[
              styles.input,
              leftIconName && styles.inputWithIcon,

              style,
              errorText && styles.inputError,
            ]}
            placeholder={isFocused ? undefined : placeholder}
            placeholderTextColor="#717878"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {typeof rightIcon === "string" ? (
            <EvilIcons
              name={rightIcon as React.ComponentProps<typeof EvilIcons>["name"]}
              size={20}
              color="#000"
              style={styles.rightIcon}
            />
          ) : (
            rightIcon
          )}
        </View>

        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      </View>
    );
  },
);

export const styles = StyleSheet.create({
  wrapper: {
    gap: Sizes.padding / 2,
  },
  container: {
    position: "relative",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
  },
  label: {
    fontFamily: "Inter-Medium",
    color: Colors.text,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    outlineWidth: 2,
    outlineColor: "black",
    padding: Sizes.padding,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.textError,
  },
  inputWithIcon: {
    paddingLeft: 36,
  },
  leftIcon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
    opacity: 0.9,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textError,
  },
  rightIcon: {
    position: "absolute",
    right: 10,
    zIndex: 1,
    opacity: 0.9,
  },
});
