import { Platform } from "react-native";
import { OneSignal } from "react-native-onesignal";

export function logoutSignal() {
  if (Platform.OS === "web") return;
  OneSignal.logout();
}
