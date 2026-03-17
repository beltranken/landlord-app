import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function removeToken(name: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(name);
  } else {
    await SecureStore.deleteItemAsync(name);
  }
}
