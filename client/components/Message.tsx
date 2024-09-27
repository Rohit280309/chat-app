import { View, Text } from 'react-native';
import React from 'react';
import { useColorScheme } from './useColorScheme';

interface MessageProps {
  message: string;
  type: string;
  sent: boolean;
  status: string | null;
}

const Message = ({ message, type, sent, status }: MessageProps) => {
  const colorScheme = useColorScheme();
  console.log(status);

  return (
    <View className={`flex flex-row ${sent ? "justify-end" : "justify-start"} p-2`}>
      <View className={`rounded-full ${colorScheme === "light" ? `${sent ? "bg-customBlue1" : "bg-white"}` : `${sent ? "bg-customBlue2" : "bg-customMessage2"}`} p-3`}>
        <Text className={`text-lg ${colorScheme === "light" ? `${sent ? "text-white" : "text-black"}` : `${sent ? "text-black" : "text-white"}`}`}>{message}</Text>
      </View>
      <View className={`${sent ? "flex" : "hidden"} items-center justify-end`}>
        <View className={`w-2 h-2 rounded-full ${status === "sent" ? "bg-blue-700" : status === "read" ? "bg-green-500" : "bg-gray-300"}`} />
      </View>
    </View>
  );
}

export default Message;
