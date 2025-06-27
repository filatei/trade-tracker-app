// src/app/(protected)/expenses/(id)/FullScreenMessage.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Text';
interface FullScreenMessageProps {
  message: string;
}

export default function FullScreenMessage({ message }: FullScreenMessageProps) {
  return (
    <View style={styles.center}>
      <Text style={{ color: '#fff'  }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' }
});