import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function getToken(name: string) {
  if (Platform.OS === "web") {
    return localStorage.getItem(name);
  } else {
    return await SecureStore.getItemAsync(name);
  }
}
