// src/components/DarkScreen.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface DarkScreenProps extends ViewProps {
  children: React.ReactNode;
}

export default function DarkScreen({ children, style, ...props }: DarkScreenProps) {
  return (
    <View className="flex-1 bg-black" style={style} {...props}>
      <StatusBar style="light" backgroundColor="#000" />
      {children}
    </View>
  );
}