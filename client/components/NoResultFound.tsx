import { View, Text, Image } from 'react-native'
import React from 'react'
import Img from "@/assets/images/empty.png";
import { useColorScheme } from './useColorScheme';

const NoResultFound = () => {

  const colorScheme = useColorScheme();

  return (
    <View className='flex items-center justify-center gap-4'>
      <Image
        source={Img}
        className='w-80 h-80'
        resizeMode='contain'
      />
      <Text className={`${colorScheme === "light" ? "text-black" : "text-white"} font-semibold text-xl`}>No Result Found</Text>
    </View>
  )
}

export default NoResultFound