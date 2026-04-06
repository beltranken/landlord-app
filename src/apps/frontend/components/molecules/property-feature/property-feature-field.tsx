import Dropdown, { type BaseItem } from "@/components/atoms/dropdown/dropdown";
import NumberStepper from "@/components/atoms/number-stepper/number-stepper";
import { Text } from "@/components/atoms/text";
import { TextInput } from "@/components/atoms/text-input/text-input";
import { Sizes } from "@/constants";
import { PropertyFeatureTypes } from "@/enums";
import type { PropertyFeature } from "@/types";
import { useMemo, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";

export interface PropertyFeatureFieldProps {
  feature: PropertyFeature;
  editable?: boolean;
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export default function PropertyFeatureField({
  feature,
  editable = true,
  value,
  onChange,
}: Readonly<PropertyFeatureFieldProps>) {
  const { featureType } = feature;

  let label = feature.name ?? featureType?.name ?? "";
  if (featureType?.unit) {
    label += ` (${featureType.unit})`;
  }

  const [internalValue, setInternalValue] = useState<string>(
    (value ?? feature.value ?? "").toString(),
  );

  const effectiveValue = value ?? internalValue;

  const handleChange = (next: string | null) => {
    setInternalValue(next ?? "");
    onChange?.(next);
  };

  const options: BaseItem[] = useMemo(() => {
    const raw = featureType?.options;
    if (!raw) return [];

    return raw
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean)
      .map((o) => ({ id: o, label: o }));
  }, [featureType?.options]);

  const type = featureType?.type as PropertyFeatureTypes | undefined;

  const content = (() => {
    switch (type) {
      case PropertyFeatureTypes.TEXT: {
        return (
          <View style={styles.inlineRow}>
            <View style={styles.flexGrow}>
              <TextInput
                value={effectiveValue ?? ""}
                onChangeText={
                  editable ? (text) => handleChange(text) : undefined
                }
                editable={editable}
                placeholder={label}
              />
            </View>
          </View>
        );
      }

      case PropertyFeatureTypes.NUMBER: {
        return (
          <View style={styles.inlineRow}>
            <View style={styles.flexGrow}>
              <NumberStepper
                value={Number(effectiveValue ?? "0")}
                onChange={
                  editable ? (val) => handleChange(String(val)) : undefined
                }
                disabled={!editable}
              />
            </View>
          </View>
        );
      }

      case PropertyFeatureTypes.OPTION: {
        return (
          <Dropdown
            items={options}
            labelKey="label"
            selectedId={effectiveValue ?? undefined}
            onSelect={
              editable ? (item) => handleChange(String(item.id)) : undefined
            }
            placeholder={label || "Select option"}
          />
        );
      }

      case PropertyFeatureTypes.BOOLEAN: {
        const boolValue = effectiveValue === "true" || effectiveValue === "1";

        return (
          <View style={styles.switchRow}>
            <Text>{boolValue ? "Yes" : "No"}</Text>
            <Switch
              value={boolValue}
              onValueChange={
                editable
                  ? (val) => handleChange(val ? "true" : "false")
                  : undefined
              }
              disabled={!editable}
            />
          </View>
        );
      }

      default: {
        if (!effectiveValue) return null;
        return <Text>{effectiveValue}</Text>;
      }
    }
  })();

  if (!content) return null;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <View style={styles.formWrapper}>
          <View style={styles.labelWrapper}>
            <Text style={styles.formLabel}>{label}</Text>
          </View>

          <View style={{ flex: 1 }}>{content}</View>
        </View>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formWrapper: {
    flexDirection: "row",
    gap: Sizes.padding,
    width: "100%",
  },
  labelWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  formLabel: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
  },
  wrapper: {
    flexDirection: "row",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.padding / 2,
  },
  flexGrow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  unitText: {
    fontFamily: "Inter-Medium",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
