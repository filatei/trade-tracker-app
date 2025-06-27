// src/components/ExpenseSummary.tsx

import React from 'react';
import { View, Text } from 'react-native';

interface ExpenseSummaryProps {
  total: number;
  pending: number;
  approved: number;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ total, pending, approved }) => (
  <View className="flex-row justify-around bg-gray-900 p-4 rounded-lg mb-4">
    <View>
      <Text className="text-gray-400 text-xs">Total</Text>
      <Text className="text-white font-bold text-lg">₦{Number(total).toLocaleString()}</Text>
    </View>
    <View>
      <Text className="text-gray-400 text-xs">Pending</Text>
      <Text className="text-yellow-400 font-bold text-lg">₦{Number(pending).toLocaleString()}</Text>
    </View>
    <View>
      <Text className="text-gray-400 text-xs">Approved</Text>
      <Text className="text-green-400 font-bold text-lg">₦{Number(approved).toLocaleString()}</Text>
    </View>
  </View>
);

export default ExpenseSummary;