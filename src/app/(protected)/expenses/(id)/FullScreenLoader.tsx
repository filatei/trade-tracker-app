import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface FullScreenLoaderProps {
  isDark: boolean;
}

export default function FullScreenLoader() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color='#fff' />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' }
});