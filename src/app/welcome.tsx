// import { Text, StyleSheet, View, Button } from 'react-native';
// import { Link, router } from 'expo-router';
// import { useAuth } from '@clerk/clerk-expo';

// export default function WelcomeScreen() {
//   const { signOut, isSignedIn } = useAuth();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to TORSME App</Text>


//       <View className='mt-4'>
        
//       </View>
//       {isSignedIn && <Link href='/(protected)'>Go to Protected Screens</Link>}

//       <View className='mt-4'>
//         {!isSignedIn && <Link href='/sign-in'>Go to Sign In</Link>}
//       </View>


//       <View className='mt-4'>
//         {isSignedIn && <Button  title='Sign out' onPress={() => signOut()}  />}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });


import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';

import { router } from 'expo-router';
// import { Container } from '../components/common/Container';
// import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  // const { theme } = useTheme();

  return (
    // <Container>
      <View style={[styles.container]}>
        <Text className='text-2xl gap-2 mb-2 font-bold text-white'>Welcome to Money App</Text>
        <Text className='text-gray-500 text-sm mb-4'>
          Your complete 
          business management solution
        </Text>
        <Button title='Get Started' onPress={() => router.push('/sign-in')} />
      </View>
    // </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
});