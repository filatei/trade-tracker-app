import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
// import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
    //   headerRight: () => <ThemeSwitcher />,
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    }}>
      <Stack.Screen name="index" options={{title: 'Profile'}} />
    </Stack>
  )
}