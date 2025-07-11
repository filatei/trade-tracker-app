import { Button, TouchableOpacity, View } from 'react-native'
import { Text } from "@/components/Text"
import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import {Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function ProfileHome() {
    const {user} = useUser()
    const {getToken} = useAuth()
    const {signOut} = useAuth()

    // logout button
    const handleLogout = async () => {
        await signOut()
    }


  return (
    <SafeAreaView className='flex-1 bg-black'>
      <View className="flex-1 items-center justify-center bg-black">
          <View className="m-2">
              <Image
              source={{ uri: user?.imageUrl }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
              />
          </View>


        <Text className='text-2xl font-bold text-center text-white bg-black'  > {user?.firstName} {user?.lastName}</Text>

          <View className="flex-row items-start gap-1">
              <Ionicons name="mail-outline" size={20} color="gray" />
              <Text className='text-gray-500' >
              {user?.emailAddresses[0].emailAddress}</Text>
              
          </View>
        
        <View className='flex-col items-start ml-4 gap-2'>
          <Text className='text-gray-500' >ID: {user?.id}</Text>
          <Text className='text-gray-500' >Last Sign In At: {user?.lastSignInAt?.toLocaleString()}</Text>
          <Text className='text-gray-500' >Phone Number: {user?.phoneNumbers[0]?.phoneNumber}</Text>
          <Text className='text-gray-500' >Username: {user?.username}</Text>
        </View>
        <View className='flex-row items-center justify-center'>
          {/* <Button title="Logout" onPress={handleLogout} color="white"  /> */}
          <TouchableOpacity onPress={handleLogout} style={{backgroundColor: 'black', padding: 10, borderRadius: 5}}>
            <Text className='text-white'>Logout</Text>
          </TouchableOpacity>
      </View>

      
      </View>
    
    </SafeAreaView>
    
  )
}