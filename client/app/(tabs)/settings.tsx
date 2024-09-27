import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Img from "../../assets/images/adaptive-icon.png"
import { useColorScheme } from '@/components/useColorScheme'
import { formatString } from '@/utils'
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

const Settings = () => {

  const colorScheme = useColorScheme();

  return (
    <SafeAreaView>

      <View className='flex-row p-4 items-center justify-between'>
        <View className='flex-row'>
          <Image
            source={Img}
            className='w-20 h-20 rounded-full'
            resizeMode='contain'
          />
          <View className='flex items-center justify-center px-4'>
            <Text className={`${colorScheme === "light" ? "text-black" : "text-white"} text-xl`}>{formatString("Rohit Kumbhar", 20)}</Text>
            <Text className={`text-gray-500 text-md`}>(+91) 8879460995</Text>
          </View>
        </View>
        <TouchableOpacity>
          <View className={`flex items-center justify-center ${colorScheme === "light" ? "bg-customBlue2" : "bg-activeTabDark"} rounded-full w-24 p-4`}>
            <Text className={`text-lg font-semibold ${colorScheme === "light" ? "text-black" : "text-white"}`}>Edit</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className='flex p-4 gap-5'>
        <Text className={`${colorScheme === "light" ? "text-customBlue1" : "text-customBlue2"} text-lg p-2`}>General</Text>
        <View className='flex gap-8 p-2'>
          <View className='flex flex-row items-center gap-3 p-2'>
            <MaterialCommunityIcons name="bell-outline" size={28} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"} />
            <Text className={`text-lg ${colorScheme === "light" ? "text-black" : "text-white"}`}>Notifications</Text>
          </View>
          <View className='flex flex-row items-center gap-3 p-2'>
            <MaterialIcons name="lock" size={28} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"}/>
            <Text className={`text-lg ${colorScheme === "light" ? "text-black" : "text-white"}`}>Privacy</Text>
          </View>
          <View className='flex flex-row items-center gap-3 p-2'>
            <MaterialIcons name="cloud-queue" size={28} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"} />
            <Text className={`text-lg ${colorScheme === "light" ? "text-black" : "text-white"}`}>Storage & Data</Text>
          </View>
          <View className='flex flex-row items-center gap-3 p-2'>
            <AntDesign name="questioncircleo" size={28} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"} />
            <Text className={`text-lg ${colorScheme === "light" ? "text-black" : "text-white"}`}>About</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Settings