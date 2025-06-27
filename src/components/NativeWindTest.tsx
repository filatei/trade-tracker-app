import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';

export function NativeWindTest() {
  return (
    <View className="flex-1 bg-black p-4">
      <View className="bg-red-500 p-4 rounded-lg mb-4">
        <Text className="text-white text-lg font-bold text-center">
          Red Background Test
        </Text>
      </View>
      
      <View className="bg-blue-500 p-4 rounded-lg mb-4">
        <Text className="text-white text-lg font-bold text-center">
          Blue Background Test
        </Text>
      </View>
      
      <View className="bg-green-500 p-4 rounded-lg mb-4">
        <Text className="text-white text-lg font-bold text-center">
          Green Background Test
        </Text>
      </View>
      
      <TouchableOpacity className="bg-purple-600 p-4 rounded-lg">
        <Text className="text-white text-center font-bold">
          Purple Button Test
        </Text>
      </TouchableOpacity>
    </View>
  );
} 