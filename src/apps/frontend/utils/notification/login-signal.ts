import { SignInResponse } from "@/api";
import { Platform } from "react-native";
import { OneSignal } from "react-native-onesignal";

export function loginSignal(data: SignInResponse["data"]) {
  if (Platform.OS === "web" || !data) return;
  try {
    OneSignal.login(String(data.userId));
  } catch (e) {
    console.error(e);
  }
}
