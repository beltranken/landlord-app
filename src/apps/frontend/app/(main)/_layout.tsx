import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="(private)" options={{ headerShown: false }} />
    </Stack>
  );
}
