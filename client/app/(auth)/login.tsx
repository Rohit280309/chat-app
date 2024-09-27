import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthForm from '@/components/AuthForm'
import { Link } from 'expo-router'
import { useColorScheme } from '@/components/useColorScheme'

const Login = () => {

  const colorScheme = useColorScheme();

  return (
    <SafeAreaView className='h-screen'>
      <AuthForm type='login' />
    </SafeAreaView>
  )
}

export default Login