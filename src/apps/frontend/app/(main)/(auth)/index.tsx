import { Redirect } from "expo-router";

export default function AuthIndexPage() {
  return <Redirect href="/(main)/(auth)/signin" />;
}
