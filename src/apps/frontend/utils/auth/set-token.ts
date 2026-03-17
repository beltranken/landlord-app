import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function setToken(name: string, token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(name, token);
  } else {
    await SecureStore.setItemAsync(name, token);
  }
}
