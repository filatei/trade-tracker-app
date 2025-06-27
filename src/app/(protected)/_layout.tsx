import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function ProtectedLayout() {
  console.log('Protected layout');

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href='/sign-in' />;
  }

  return (
    <Tabs screenOptions={{
      headerShown: false,
      // headerRight: () => <ThemeSwitcher />,
    }}>
      <Tabs.Screen name="index" options={{title: 'Home',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="home-outline" color={color} size={size} />
        )
      }} />
      <Tabs.Screen name="expenses" options={{title: 'Expenses',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="wallet-outline" color={color} size={size} />
        )
      }} />
      <Tabs.Screen name="sales" options={{title: 'Sales',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="cart-outline" color={color} size={size} />
        )
      }} />
      <Tabs.Screen name="finance" options={{title: 'Finance',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="cash-outline" color={color} size={size} />
        )
      }} />
      <Tabs.Screen name="profile" options={{title: 'Profile',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="person-outline" color={color} size={size} />
        )
      }} />
    </Tabs>

    
  );
}
