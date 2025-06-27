// src/app/(protected)/finance/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function FinanceLayout() {
  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Finance' }} />
        <Stack.Screen name="investing" options={{ title: 'Investing' }} />
        <Stack.Screen name="trading" options={{ title: 'Trading' }} />
        <Stack.Screen name="crypto" options={{ title: 'Crypto' }} />
        <Stack.Screen name="commodities" options={{ title: 'Commodities' }} />
      </Stack>
    </SafeAreaView>

  );
}