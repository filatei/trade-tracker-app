import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';

export function TestNativeWind() {
  return (
    <View className="p-4 bg-red-500">
      <Text className="text-white text-lg font-bold">
        NativeWind Test - This should have red background and white text
      </Text>
    </View>
  );
} 