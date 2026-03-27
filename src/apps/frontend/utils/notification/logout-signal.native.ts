import { OneSignal } from "react-native-onesignal";

export function logoutSignal() {
  OneSignal.logout();
}
