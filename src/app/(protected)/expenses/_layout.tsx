import React from 'react';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExpensesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
      />
      <Stack.Screen 
        name="create" 
        options={{
          headerShown: true,
          title: 'Add Expense',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                padding: 8,
              })}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
