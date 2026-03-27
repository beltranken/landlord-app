import "react-native-reanimated";

import { client } from "@/api/client.gen";
import Colors from "@/constants/colors-old";
import useOneSignal from "@/hooks/useOneSignal";
import AuthProvider from "@/providers/auth-provider";
import QueryClientProvider from "@/providers/queyr-client-provider";
import {
  Inter_100Thin,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

client.setConfig({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
  withCredentials: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Inter-Thin": Inter_100Thin,
    "Inter-Light": Inter_300Light,
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-ExtraBold": Inter_800ExtraBold,
    "Inter-Black": Inter_900Black,
  });

  useOneSignal();

  if (!loaded) {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
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
