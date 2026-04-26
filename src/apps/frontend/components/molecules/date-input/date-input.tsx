import {
  TextInputProps,
  styles as TIStyles,
} from "@/components/atoms/text-input/text-input";
import { BaseStyles, Colors, Sizes } from "@/constants";
import {
  DatePicker,
  DatePickerProps as RNDatePickerProps,
} from "@react-native-blossom-ui/dates";
import { StyleSheet } from "react-native";

interface DateInputProps
  extends
    Pick<TextInputProps, "label" | "labelStyle">,
    Omit<RNDatePickerProps, "defaultDate" | "onChange" | "onDateChange"> {
  value?: Date | null;
  onChange: (date: Date) => void;
}

export default function DateInput({
  value,
  onChange,
  label,
  labelStyle,
  error,
  ...props
}: Readonly<DateInputProps>) {
  const pickerValueKey = value ? value.getTime().toString() : "empty";

  return (
    <DatePicker
      key={pickerValueKey}
      label={label}
      labelStyle={[styles.label, labelStyle]}
      containerStyle={styles.container}
      inputTextStyle={[styles.input, error && TIStyles.inputError]}
      errorStyle={TIStyles.errorText}
      inputContainerStyle={[styles.inputContainerStyle, BaseStyles.shadow]}
      dateDisplayDelimiter="to"
      datePickerMode="single"
      showAdjacentMonthDays={true}
      displayDateFormat="YYYY-MM-DD"
      outputDateFormat="YYYY-MM-DD"
      defaultDate={value ?? undefined}
      onDateChange={(changedData) => {
        if (changedData.mode === "single" && changedData.date) {
          onChange(changedData.date);
        }
      }}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  calendarBtn: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontFamily: "Inter-Medium",
    color: Colors.text,
    textTransform: "uppercase",
  },
  container: {
    gap: Sizes.padding / 2,
  },
  input: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  inputContainerStyle: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    marginVertical: 0,
    padding: Sizes.padding,
  },
});
