// src/app/(protected)/expenses/(id)/ReceiptThumbnail.tsx
import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ReceiptThumbnailProps {
  uri: string;
  onPress: () => void;
}

export default function ReceiptThumbnail({ uri, onPress }: ReceiptThumbnailProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri }} style={styles.thumb} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
});