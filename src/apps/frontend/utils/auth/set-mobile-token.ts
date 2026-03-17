import { Platform } from "react-native";
import { setToken } from "./set-token";
import { removeToken } from "./remove-token";

export async function setMobileToken(token?: string) {
  if (Platform.OS === "web") return;

  if (!token) {
    await removeToken("refreshToken");
  } else {
    await setToken("refreshToken", token);
  }
}
