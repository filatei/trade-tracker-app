import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'

export default function investing() {
  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView className="flex-1 bg-black p-4">
        <View className="flex-1 bg-black p-4">
          <Text className="text-white text-2xl font-bold">Investing</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}