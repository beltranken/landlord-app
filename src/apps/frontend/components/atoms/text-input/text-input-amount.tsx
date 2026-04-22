import { BaseStyles, Colors, Sizes } from "@/constants";
import formatMoney from "@/utils/format-money";
import React, { forwardRef, useMemo, useState } from "react";
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

export interface TextInputAmountMaskOptions {
  locale?: string;
  currency?: string;
  showCurrency?: boolean;
  decimalPlaces?: { min?: number; max?: number };
}

export type TextInputAmountProps = Omit<
  RNTextInputProps,
  "value" | "onChange" | "onChangeText" | "keyboardType"
> & {
  label?: string;
  labelStyle?: TextProps["style"];
  wrapperStyle?: ViewProps["style"];
  containerStyle?: ViewProps["style"];
  errorText?: string;
  value?: number | null;
  onChange?: (value: number) => void;
  maskOptions?: TextInputAmountMaskOptions;
};

export const TextInputAmount = forwardRef<
  RNTextInput,
  Readonly<TextInputAmountProps>
>((props, ref) => {
  const {
    label,
    placeholder,
    errorText,
    style,
    onFocus,
    onBlur,
    value,
    labelStyle,
    containerStyle,
    wrapperStyle,
    onChange,
    maskOptions = {},
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [rawText, setRawText] = useState<string>(
    value != null ? String(value) : "",
  );

  const handleFocus: TextInputAmountProps["onFocus"] = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: TextInputAmountProps["onBlur"] = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    // Strip non-digit characters except decimal point
    const normalized = text.replace(/[^0-9.]/g, "");
    setRawText(normalized);

    const numeric = Number(normalized || "0");
    onChange?.(isNaN(numeric) ? 0 : numeric);
  };

  const displayValue = useMemo(() => {
    if (isFocused) return rawText;
    if (rawText === "") return "";

    const numeric = Number(rawText || "0");
    if (!isFinite(numeric)) return rawText;

    return formatMoney(numeric, {
      showCurrency: false,
      ...maskOptions,
    });
  }, [isFocused, rawText, maskOptions]);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View style={[styles.container, containerStyle]}>
        <TextInputBase
          ref={ref}
          {...rest}
          value={displayValue}
          keyboardType="numeric"
          style={[
            styles.input,
            BaseStyles.shadow,
            style,
            errorText && styles.inputError,
          ]}
          placeholder={isFocused ? undefined : placeholder}
          placeholderTextColor="#717878"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
        />
        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      </View>
    </View>
  );
});

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
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.textError,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textError,
  },
});
