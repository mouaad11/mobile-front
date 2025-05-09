import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '@/constant/Colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
      screenOptions={{
        headerShown: false,
          contentStyle: {
            backgroundColor: Colors.BACKGROUND,
        },
      }}
    >
        <Stack.Screen
          name="splash"
        options={{
            animation: 'fade',
        }}
      />
        <Stack.Screen
          name="login"
        options={{
            animation: 'fade',
        }}
      />
        <Stack.Screen
          name="(tabs)"
        options={{
            headerShown: false,
            animation: 'fade',
        }}
      />
      </Stack>
    </SafeAreaProvider>
  );
}
