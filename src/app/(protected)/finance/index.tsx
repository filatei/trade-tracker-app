// src/app/(protected)/finance/index.tsx
import {  Text, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function FinanceHome() {
  const router = useRouter();

  const screens = [
    { label: 'Investing', path: 'investing' },
    { label: 'Trading', path: 'trading' },
    { label: 'Crypto', path: 'crypto' },
    { label: 'Commodities', path: 'commodities' },
    { label: 'Options', path: 'options' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView className="flex-1 bg-black p-4">
        {screens.map((screen) => (
          <Pressable
            key={screen.path}
            onPress={() => router.push(`/finance/${screen.path}`)}
            className="bg-gray-800 p-4 rounded mb-4"
          >
            <Text className="text-white text-lg font-bold">{screen.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}