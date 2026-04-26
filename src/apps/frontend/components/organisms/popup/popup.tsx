import { Text } from "@/components/atoms/text";
import { Sizes } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Modal, ModalProps, Pressable, StyleSheet, View } from "react-native";

interface PopupProps extends ModalProps {
  title?: string;
  onClose?: () => void;
}

export default function Popup({
  title,
  onClose,
  children,
  ...modalProps
}: Readonly<PopupProps>) {
  return (
    <Modal animationType="none" visible={true} transparent {...modalProps}>
      <View style={styles.wrapper}>
        <BlurView intensity={30} style={styles.blurView}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              {title && <Text>{title}</Text>}

              <View style={styles.closeButtonContainer}>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={16} color="black" />
                </Pressable>
              </View>
            </View>

            <View style={styles.contentContainer}>{children}</View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000B2",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    width: Sizes.maxWidth,
    maxWidth: "100%",
    minHeight: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
  },
  blurView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: "100%",
    padding: Sizes.padding,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: Sizes.padding,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F0F0F0",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: Sizes.padding,
  },
  contentContainer: {
    padding: Sizes.padding,
    gap: Sizes.padding,
  },
});
