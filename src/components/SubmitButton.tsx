// src/components/SubmitButton.tsx
import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function SubmitButton({ onPress, disabled }: {
  onPress: () => void,
  disabled: boolean
}) {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="mr-4">
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`px-4 py-1 rounded-full ${
          disabled ? 'bg-gray-500' : 'bg-yellow-500'
        }`}>
        <Text className="text-black font-bold text-sm">Save</Text>
      </Pressable>
    </Animated.View>
  );
}
