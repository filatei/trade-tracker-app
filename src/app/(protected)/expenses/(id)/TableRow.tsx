// src/app/(protected)/expenses/(id)/TableRow.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
// import { useTheme } from '@/context/ThemeContext';

interface TableRowProps {
  cells: React.ReactNode[];
}

export default function TableRow({ cells }: TableRowProps) {
  // const { theme } = useTheme();
  // const isDark = theme === 'dark';

  return (
    <View style={[styles.row]}>
      {cells.map((c, i) => (
        <View key={i} style={styles.cell}>
          {c}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
  },
});