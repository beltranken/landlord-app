import {
  TextInput,
  TextInputProps,
} from "@/components/atoms/text-input/text-input";
import { forwardRef } from "react";
import type { TextInput as RNTextInput } from "react-native";

export type TextAreaProps = Omit<
  TextInputProps,
  "multiline" | "numberOfLines"
> & {
  rows?: number;
};

export const TextArea = forwardRef<RNTextInput, Readonly<TextAreaProps>>(
  ({ rows = 4, style, ...rest }, ref) => {
    return (
      <TextInput
        ref={ref}
        {...rest}
        multiline
        numberOfLines={rows}
        style={[{ textAlignVertical: "top" }, style]}
      />
    );
  },
);
