// Path: app/_layout.tsx
// `react-native-gesture-handler` must be imported before other imports (Drawer / gestures).
import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GestureHandlerRootView } = require('react-native-gesture-handler');

function RootNavigator() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const authReady = !isAuthLoading;

  useEffect(() => {
    if (!authReady) return;

    const rootSegment = segments[0];
    const inLoginScreen = rootSegment === 'login';
    const atRootIndex = segments.length === 0;

    if (atRootIndex) {
      router.replace(isAuthenticated ? '/(drawer)/home' : '/login');
      return;
    }

    if (!isAuthenticated && !inLoginScreen) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && inLoginScreen) {
      router.replace('/(drawer)/home');
    }
  }, [authReady, isAuthenticated, router, segments]);

  if (!authReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootNavigator />
        </GestureHandlerRootView>
      </LanguageProvider>
    </AuthProvider>
  );
}
