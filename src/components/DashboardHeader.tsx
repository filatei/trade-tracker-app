// src/components/DashboardHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

interface DashboardHeaderProps {
  userImageUrl: string | null;
}

export default function DashboardHeader({ userImageUrl }: DashboardHeaderProps) {
  return (
    <View className="m-2 flex-row items-center justify-between gap-2">
      <Text className="text-xl font-bold text-gray-800 mb-4">📈 Trader Dashboard</Text>
      {userImageUrl && (
        <Image
          source={{ uri: userImageUrl }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
      )}
    </View>
  );
}
