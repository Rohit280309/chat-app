import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Img from "../../assets/images/icon.png";
import { useColorScheme } from '@/components/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';


const Profile = () => {

  const { id } = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <SafeAreaView className='h-screen'>
      <View className='w-full p-4 flex flex-row justify-between'>
        <Pressable onPress={() => router.back()}><AntDesign name="arrowleft" size={24} color={colorScheme === "light" ? "black" : "white"} /></Pressable>
        <Entypo name="dots-three-vertical" size={20} color={colorScheme === "light" ? "black" : "white"} />
      </View>
      <View className='flex justify-center items-center p-5 gap-8'>
        <Image source={Img} resizeMode='contain' className={`w-32 h-32 border shadow-xl ${colorScheme === "light" ? "border-black shadow-black" : "border-white shadow-white"} rounded-full`} />
        <View className='flex items-center justify-center gap-2'>
          <Text className={`text-4xl ${colorScheme === "light" ? "text-black" : "text-white"}`}>Rohit Kumbhar</Text>
          <Text className={`text-lg text-gray-500`}>(+91) 8879460995</Text>
        </View>
      </View>

      <View className='w-full flex-row items-center justify-center gap-10 p-5'>
        <View className='flex items-center justify-center gap-2'>
          <View className={`w-14 h-14 rounded-full flex justify-center items-center ${colorScheme === "light" ? "bg-customBlue1" : "bg-customBlue2"}`}>
            <MaterialCommunityIcons name="pencil-outline" size={24} color={colorScheme === "light" ? "white" : "black"} />
          </View>
          <Text className={`font-semibold ${colorScheme === "light" ? "text-customBlue1" : "text-customBlue2"}`}>Messages</Text>
        </View>
        <View className='flex items-center justify-center gap-2'>
          <View className={`w-14 h-14 rounded-full flex justify-center items-center ${colorScheme === "light" ? "bg-customBlue1" : "bg-customBlue2"}`}>
            <Ionicons name="call-outline" size={24} color={colorScheme === "light" ? "white" : "black"} />
          </View>
          <Text className={`font-semibold ${colorScheme === "light" ? "text-customBlue1" : "text-customBlue2"}`}>Call</Text>
        </View>
        <View className='flex items-center justify-center gap-2'>
          <View className={`w-14 h-14 rounded-full flex justify-center items-center ${colorScheme === "light" ? "bg-customBlue1" : "bg-customBlue2"}`}>
            <Feather name="video" size={25} color={colorScheme === "light" ? "white" : "black"} />
          </View>
          <Text className={`font-semibold ${colorScheme === "light" ? "text-customBlue1" : "text-customBlue2"}`}>Video Call</Text>
        </View>
      </View>

      <View className='p-4 gap-5'>
        <Text className={`text-md ${colorScheme === "light" ? "text-customBlue1" : "text-customBlue2"}`}>More actions</Text>
        <View className='flex flex-row items-center gap-3 p-2'>
          <MaterialIcons name="image" size={28} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"} />
          <Text className={`text-lg ${colorScheme === "light" ? "text-black" : "text-white"}`}>View Media</Text>
        </View>
        <View className='flex flex-row items-center gap-3 p-2'>
          <Ionicons name="search-sharp" size={28} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"} />
          <Text className={`text-lg ${colorScheme === "light" ? "text-black" : "text-white"}`}>Search in conversation</Text>
        </View>
        <View className='flex flex-row items-center gap-3 p-2'>
          <MaterialCommunityIcons name="bell-outline" size={28} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"} />
          <Text className={`text-lg ${colorScheme === "light" ? "text-black" : "text-white"}`}>Notifications</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Profile