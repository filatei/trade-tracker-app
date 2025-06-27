// src/app/(protected)/expenses/(id)/Table.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Text';
// import { useTheme } from '@/context/ThemeContext';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  // const { theme } = useTheme();
  // const isDark = theme === 'dark';

  return (
    <>
      <View style={[styles.headerRow]}>          
        {headers.map((h, i) => (
          <View key={i} style={styles.cell}>
            <Text style={[styles.headerText]}>
              {h}
            </Text>
          </View>
        ))}
      </View>
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  cell: {
    flex: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});