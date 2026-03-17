import { BaseStyles } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import type { TextInput as RNTextInput } from "react-native";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput as TextInputBase,
  TextInputProps,
  View,
} from "react-native";

type FloatingTextInputProps = TextInputProps & {
  floatingPlaceholder?: string;
  leftIconName?: React.ComponentProps<typeof Ionicons>["name"];
  errorText?: string;
};

export const TextInput = forwardRef<
  RNTextInput,
  Readonly<FloatingTextInputProps>
>((props, ref) => {
  const {
    floatingPlaceholder,
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
  const animated = useRef(new Animated.Value(0)).current;

  const label = floatingPlaceholder ?? placeholder;

  useEffect(() => {
    const shouldFloat = isFocused;

    Animated.timing(animated, {
      toValue: shouldFloat ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [animated, isFocused]);

  const handleFocus: TextInputProps["onFocus"] = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: TextInputProps["onBlur"] = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const labelTranslateY = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -20],
  });

  const labelScale = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  return (
    <View style={[styles.container]}>
      {leftIconName && (
        <Ionicons
          name={leftIconName}
          size={20}
          color="#000"
          style={styles.leftIcon}
        />
      )}
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              left: leftIconName ? 36 : 8,
              transform: [
                { translateY: labelTranslateY },
                { scale: labelScale },
              ],
              opacity: isFocused ? 1 : 0,
              borderWidth: isFocused ? 1 : 0,
              borderColor: isFocused ? "#ddd" : "transparent",
              backgroundColor: isFocused ? "#ffffff" : "transparent",
              paddingHorizontal: 8,
              borderRadius: 4,
            },
          ]}
        >
          {label}
        </Animated.Text>
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
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    color: "#888",
    backgroundColor: "transparent",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    outlineWidth: 2,
    outlineColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: "#d32f2f",
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
    color: "#d32f2f",
  },
});
