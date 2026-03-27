import React, { forwardRef } from "react";
import type { TextInput as RNTextInput } from "react-native";
import { TextInput, TextInputProps } from "../text-input/text-input";
export const PasswordInput = forwardRef<RNTextInput, Readonly<TextInputProps>>(
  (props, ref) => {
    return <TextInput {...props} secureTextEntry ref={ref} />;
  },
);
