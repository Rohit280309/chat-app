import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthForm from '@/components/AuthForm'
import { Link } from 'expo-router'
import { useColorScheme } from '@/components/useColorScheme'

const Signup = () => {

  const colorScheme = useColorScheme();

  return (
    <SafeAreaView>
      <AuthForm type='signup' />
      {/* <View className='flex-row justify-center items-center p-4'>
        <Text className={`font-semibold ${colorScheme === "light" ? "text-black" : "text-white"}`}></Text>
        <Link className='text-blue-500 font-semibold' href="/login">Login</Link>
      </View> */}
    </SafeAreaView>
  )
}

export default Signup