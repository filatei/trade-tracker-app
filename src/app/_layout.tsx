// src/app/_layout.tsx
import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import SplashScreen from '@/components/SplashScreen';
import { APP_CONFIG } from '@/config/constants';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import global CSS
import '../global.css';

SystemUI.setBackgroundColorAsync('#000');

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <ClerkProvider
          publishableKey={APP_CONFIG.CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}
        >
          <ClerkLoaded>
            <InitClerkToken />
            {showSplash ? <SplashScreen /> : <RootLayoutNav />}
            <StatusBar style="light" backgroundColor="#000" />
          </ClerkLoaded>
        </ClerkProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function InitClerkToken() {
  const { getToken, isSignedIn } = useAuth();
  const { setToken, clearToken } = useAuthStore();

  useEffect(() => {
    const updateToken = async () => {
      try {
        const token = await getToken({ template: 'api-access' });
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setToken(token, payload.exp * 1000);
        } else {
          clearToken();
        }
      } catch (error) {
        console.error('Failed to get token:', error);
        clearToken();
      }
    };

    if (isSignedIn) {
      updateToken();
    } else {
      clearToken();
    }
  }, [isSignedIn]);

  return null;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ title: 'Welcome' }} />
    </Stack>
  );
}