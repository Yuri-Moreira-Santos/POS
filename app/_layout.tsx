import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#455A64" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
