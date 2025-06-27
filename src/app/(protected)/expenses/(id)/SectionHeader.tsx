// src/app/(protected)/expenses/(id)/SectionHeader.tsx
import React from 'react';
import {  StyleSheet } from 'react-native';
import { Text } from '@/components/Text';
// import { useTheme } from '@/context/ThemeContext';

interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  // const { theme } = useTheme();
  // const isDark = theme === 'dark';

  return (
    <Text style={[styles.header]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
});