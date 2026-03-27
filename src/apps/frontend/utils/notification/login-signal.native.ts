import { SignInResponse } from "@/api";
import { OneSignal } from "react-native-onesignal";

export function loginSignal(data: SignInResponse["data"]) {
  try {
    OneSignal.login(String(data.userId));
  } catch (e) {
    console.error(e);
  }
}
