// src/components/RecentProfitsList.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface RecentProfitsListProps {
  profits: { date: string; amount: number }[];
}

export default function RecentProfitsList({ profits }: RecentProfitsListProps) {
  const recent = profits.slice(-5).reverse();

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-2">🧾 Recent Profits</Text>
      {recent.length === 0 ? (
        <Text className="text-sm text-gray-500">No profits yet.</Text>
      ) : (
        recent.map((p, i) => (
          <View key={i} className="flex-row justify-between border-b py-2">
            <Text>{new Date(p.date).toDateString()}</Text>
            <Text className="font-semibold text-green-700">+${p.amount.toLocaleString()}</Text>
          </View>
        ))
      )}
    </View>
  );
}