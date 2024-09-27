import { View, TextInput, StyleSheet } from 'react-native'
import React, { SetStateAction, useState } from 'react'
import { useColorScheme } from './useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const SearchBar = ({ title, searchText, setSearchText }: { title: string, searchText: string, setSearchText: any}) => {
  const [text, setText] = useState<string>("");

  const colorScheme = useColorScheme();

  return (
    <View className='p-5 py-2'>
      <View className={`flex flex-row items-center ${colorScheme === "light" ? "bg-[#EFF1F8]" : "bg-[#1E2A32]"} rounded-full p-2`}>
        <FontAwesome
          className={`p-1 ml-2`} name="search" size={20}
          color={colorScheme === "light" ? "#74777F" : "white"}
        />
        <TextInput
          className={`ml-2 w-5/6 ${colorScheme === "light" ? "text-black" : "text-white"}`}
          value={searchText}
          onChangeText={setSearchText}
          placeholder={title}
          placeholderTextColor={`${colorScheme === "light" ? "#74777F" : "white"}`}
        />
      </View>
    </View>
  )
}


export default SearchBar
