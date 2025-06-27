// src/app/(protected)/finance/options/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';

export default function OptionsDrawerLayout() {
  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#facc15',
        drawerActiveTintColor: '#facc15',
        drawerInactiveTintColor: '#aaa',
        drawerStyle: { backgroundColor: '#000' },
        drawerIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: 'book-outline',
            greeks: 'pulse-outline',
            strategyDefinitions: 'bulb-outline',
            riskDiagrams: 'trending-up-outline',
            optionsChain: 'layers-outline',
            volatilitySmile: 'stats-chart-outline',
          };
          return <Ionicons name={icons[route.name] || 'help-circle-outline'} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="index" options={{ title: 'Intro' }} />
      <Drawer.Screen name="greeks" options={{ title: 'Greeks' }} />
      <Drawer.Screen name="strategyDefinitions" options={{ title: 'Strategies' }} />
      <Drawer.Screen name="riskDiagrams" options={{ title: 'Diagrams' }} />
      <Drawer.Screen name="optionsChain" options={{ title: 'Options Chain' }} />
      <Drawer.Screen name="volatilitySmile" options={{ title: 'Volatility Smile' }} />
    </Drawer>
  );
}