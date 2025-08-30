import Colors from "@/constants/colors";
import AuthProvider from "@/providers/auth-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, height: 570 }}>
        <GestureHandlerRootView style={{ flex: 1, height: 570 }}>
          <AuthProvider>
            <Stack
              screenOptions={{
                contentStyle: {
                  backgroundColor: Colors.surface,
                },
              }}
            >
              <Stack.Screen name="(main)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </AuthProvider>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
