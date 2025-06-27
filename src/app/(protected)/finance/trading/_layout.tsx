// src/app/(protected)/finance/trading/_layout.tsx

import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';

export default function TradingDrawerLayout() {
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
      <Drawer.Screen name="orders" options={{ title: 'Orders' }} />
      <Drawer.Screen name="positions" options={{ title: 'Positions' }} />
      <Drawer.Screen name="trade" options={{ title: 'Trade' }} />
      <Drawer.Screen name="placeTrade" options={{ title: 'Place Trade' }} />
      <Drawer.Screen name="accounts" options={{ title: 'Accounts' }} />
    </Drawer>
  );
}
// import { Drawer } from 'expo-router/drawer';

// export default function TradingDrawerLayout() {
//   return (
//     <Drawer
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: { backgroundColor: '#000' },
//         drawerActiveTintColor: '#facc15',
//         drawerInactiveTintColor: '#aaa',
//       }}
//     >
//       <Drawer.Screen name="index" options={{ title: 'Overview' }} />
//       <Drawer.Screen name="accounts" options={{ title: 'Accounts' }} />
//       <Drawer.Screen name="positions" options={{ title: 'Positions' }} />
//       <Drawer.Screen name="orders" options={{ title: 'Orders' }} />
//       <Drawer.Screen name="trade" options={{ title: 'Place Trade' }} />
//     </Drawer>
//   );
// }