import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Protected guard={true}>
        <Stack.Screen name="(private)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
