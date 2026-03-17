import { BlurView } from "expo-blur";
import React from "react";
import { Modal, ModalProps, StyleSheet, View } from "react-native";
import { Button } from "../button/button";
import Text from "../text/text-ui";

type AlertModalProps = ModalProps & {
  message: string;
  buttonLabel?: string;
  onPress?: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
};

export default function AlertModal({
  message,
  buttonLabel,
  onPress,
  cancelLabel,
  onCancel,
  ...modalProps
}: Readonly<AlertModalProps>) {
  return (
    <Modal animationType="none" transparent {...modalProps}>
      <View style={styles.container}>
        <BlurView intensity={30} style={styles.blurView}>
          <View style={styles.innerBox}>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonsRow}>
              {buttonLabel && (
                <Button
                  onPress={onPress}
                  containerStyle={styles.buttonContainer}
                >
                  {buttonLabel}
                </Button>
              )}

              {cancelLabel && (
                <Button
                  onPress={onCancel}
                  containerStyle={styles.buttonContainer}
                >
                  {cancelLabel}
                </Button>
              )}
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000B2",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  blurView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  innerBox: {
    minHeight: 112,
    width: 280,
    maxWidth: "90%",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "white",
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
  },
});
