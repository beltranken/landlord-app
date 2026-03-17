import "react-native-reanimated";

import { client } from "@/api/client.gen";
import Colors from "@/constants/colors-old";
import AuthProvider from "@/providers/auth-provider";
import QueryClientProvider from "@/providers/queyr-client-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  LogLevel,
  NotificationClickEvent,
  NotificationWillDisplayEvent,
  OneSignal,
} from "react-native-onesignal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

client.setConfig({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
  withCredentials: true,
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (Platform.OS === "web") return;

    const NOTIF_MODE = process.env.EXPO_PUBLIC_NOTIF_MODE ?? "development";

    OneSignal.Debug.setLogLevel(
      NOTIF_MODE === "production" ? LogLevel.Error : LogLevel.Verbose,
    );
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
    OneSignal.Notifications.requestPermission(false);

    OneSignal.Notifications.addEventListener(
      "click",
      (_event: NotificationClickEvent) => {
        // TODO: Handle notification click events
      },
    );

    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event: NotificationWillDisplayEvent) => {
        event.preventDefault();

        // TODO: Handle foreground notification events

        event.getNotification().display();
      },
    );
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, height: 570 }}>
        <GestureHandlerRootView style={{ flex: 1, height: 570 }}>
          <QueryClientProvider>
            <AuthProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: Colors.surface,
                  },
                }}
              >
                <Stack.Screen name="(main)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </AuthProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
