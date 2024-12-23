// app/(auths)/_layout.tsx

import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="OTP" />
    </Stack>
  );
}
