import { Colors, Sizes } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../text";

export type BaseItem = {
  id: number | string;
  [key: string]: unknown;
};

export interface DropdownProps<TItem extends BaseItem> {
  items: TItem[];
  labelKey: keyof TItem;
  selectedId?: number | string;
  onSelect?: (item: TItem) => void;
  placeholder?: string;
  triggerStyle?: ViewStyle;
  wrapperStyle?: ViewStyle;
  triggerTextStyle?: TextStyle;
  label?: string;
  labelStyle?: TextStyle;
  errorText?: string;
}

export default function Dropdown<TItem extends BaseItem>({
  items,
  labelKey,
  selectedId,
  onSelect,
  placeholder = "Select an option",
  triggerStyle,
  wrapperStyle,
  triggerTextStyle,
  label,
  labelStyle,
  errorText,
}: Readonly<DropdownProps<TItem>>) {
  const [visible, setVisible] = useState(false);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId],
  );

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const handleSelect = (item: TItem) => {
    onSelect?.(item);
    closeModal();
  };

  const getLabel = (item: TItem | undefined) => {
    if (!item) return undefined;
    const value = item[labelKey];
    return typeof value === "string" || typeof value === "number"
      ? String(value)
      : undefined;
  };

  const selectedLabel = getLabel(selectedItem);

  return (
    <View style={[dropdownStyles.wrapper, wrapperStyle]}>
      {label && <Text style={[dropdownStyles.label, labelStyle]}>{label}</Text>}

      <View style={dropdownStyles.container}>
        <Pressable
          style={[
            dropdownStyles.trigger,
            triggerStyle,
            errorText && dropdownStyles.triggerError,
          ]}
          onPress={openModal}
          accessibilityRole="button"
        >
          {selectedLabel ? (
            <Text style={[dropdownStyles.triggerText, triggerTextStyle]}>
              {selectedLabel}
            </Text>
          ) : (
            <Text
              style={[
                dropdownStyles.triggerText,
                triggerTextStyle,
                { color: "#717878" },
              ]}
            >
              {placeholder}
            </Text>
          )}

          <Ionicons name="chevron-down" size={24} color={Colors.text} />
        </Pressable>

        {errorText ? (
          <Text style={dropdownStyles.errorText}>{errorText}</Text>
        ) : null}
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={dropdownStyles.overlay}>
          <View style={dropdownStyles.modalContent}>
            <ScrollView
              style={dropdownStyles.itemsScrollArea}
              contentContainerStyle={dropdownStyles.itemsContentContainer}
            >
              {items.map((item) => {
                const label = getLabel(item) ?? String(item.id);
                const isSelected = item.id === selectedId;

                return (
                  <Pressable
                    key={item.id}
                    style={dropdownStyles.item}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        dropdownStyles.itemText,
                        isSelected && dropdownStyles.itemTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable style={dropdownStyles.closeButton} onPress={closeModal}>
              <Text style={dropdownStyles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const dropdownStyles = StyleSheet.create({
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
  trigger: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    padding: Sizes.padding,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  triggerError: {
    borderColor: Colors.textError,
  },
  triggerText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Inter-Medium",
  },
  contentContainer: {
    padding: 16,
    gap: 8,
  },
  item: {
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
  },
  itemTextSelected: {
    fontFamily: "Inter-Bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Sizes.padding * 2,
  },
  modalContent: {
    width: "80%",
    maxHeight: "100%",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  itemsScrollArea: {
    flexGrow: 0,
  },
  itemsContentContainer: {
    paddingBottom: 8,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 14,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textError,
  },
});
