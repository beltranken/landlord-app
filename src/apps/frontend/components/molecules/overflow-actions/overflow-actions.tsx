import { Colors, Sizes } from "@/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type OverflowAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  actions: OverflowAction[];
};

export default function OverflowActions({ actions }: Props) {
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(1)).current;

  const openMenu = () => {
    translateY.setValue(1);
    setVisible(true);

    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = (afterClose?: () => void) => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      afterClose?.();
    });
  };

  const handlePressAction = (action: OverflowAction) => {
    closeMenu(action.onPress);
  };

  return (
    <>
      <Pressable hitSlop={8} onPress={openMenu}>
        <MaterialCommunityIcons
          name="dots-vertical"
          size={20}
          color={Colors.text}
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => closeMenu()}
      >
        <Pressable style={styles.backdrop} onPress={() => closeMenu()}>
          <Animated.View
            style={[
              styles.menuContainer,
              {
                transform: [
                  {
                    translateY: translateY.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 40],
                    }),
                  },
                ],
              },
            ]}
          >
            {actions.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.menuItem}
                onPress={() => handlePressAction(action)}
              >
                <View style={styles.menuItemContent}>
                  {action.icon}
                  <Text
                    style={[
                      styles.menuItemText,
                      action.destructive && styles.menuItemTextDestructive,
                    ]}
                  >
                    {action.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: Colors.white,
    paddingVertical: Sizes.padding / 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItem: {
    paddingVertical: Sizes.padding,
    paddingHorizontal: Sizes.padding * 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.padding / 2,
  },
  menuItemText: {
    fontFamily: "Inter-Medium",
    color: Colors.text,
  },
  menuItemTextDestructive: {
    color: Colors.textError,
  },
});
