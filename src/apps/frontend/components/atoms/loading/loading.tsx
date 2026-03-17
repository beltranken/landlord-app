import { BlurView } from "expo-blur";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ModalProps,
  StyleSheet,
  View,
} from "react-native";

export default function Loading(props: Readonly<ModalProps>) {
  return (
    <Modal animationType="none" transparent={true} {...props}>
      <View style={styles.container} testID="loading-ui">
        <BlurView intensity={30} style={styles.blurView}>
          <View style={styles.innerBox}>
            <ActivityIndicator color="#783D10" />
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
    backgroundColor: "black",
  },
  innerBox: {
    height: 112,
    width: 112,
    maxHeight: "100%",
    maxWidth: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "white",
  },
});
