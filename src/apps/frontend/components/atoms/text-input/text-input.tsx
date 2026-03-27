import { BaseStyles, Colors, Sizes } from "@/constants";
import { EvilIcons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import type { TextInput as RNTextInput } from "react-native";
import {
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  TextInput as TextInputBase,
  View,
} from "react-native";

export type TextInputProps = RNTextInputProps & {
  label?: string;
  leftIconName?: React.ComponentProps<typeof EvilIcons>["name"];
  errorText?: string;
};

export const TextInput = forwardRef<RNTextInput, Readonly<TextInputProps>>(
  (props, ref) => {
    const {
      label,
      placeholder,
      leftIconName,
      errorText,
      style,
      onFocus,
      onBlur,
      value,
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
      <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View style={[styles.container]}>
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
              BaseStyles.shadow,
              style,
              errorText && styles.inputError,
            ]}
            placeholder={isFocused ? undefined : placeholder}
            placeholderTextColor="#717878"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    gap: Sizes.padding / 2,
  },
  container: {
    position: "relative",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Inter-Medium",
    color: Colors.text,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#E1E3E4",
    borderWidth: 2,
    borderColor: "#E1E3E4",
    borderRadius: 8,
    outlineWidth: 2,
    outlineColor: "black",
    padding: Sizes.padding,
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
});
