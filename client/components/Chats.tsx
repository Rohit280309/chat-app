import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useColorScheme } from './useColorScheme';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDb } from '@/context/DbContext';
import { getChatDetails, updateUnreadMessages } from '@/db/chats.utils';
import { getLastMessageFromDb, insertMessageIntoDb } from '@/db/messages.utils';
import { formatDate, PlayActiveIncomingMsg, PlayIncomingMsg } from '@/utils';
import { useSocket } from '@/context/SocketContext';

const Chats = ({ image, phoneNo, name, id }: ContactProps) => {
  const router = useRouter();
  const { socket } = useSocket();
  const { db }= useDb();

  const [unRead, setUnread] = useState<number>(0);
  const [messageDetails, setMessageDetails] = useState<{ lastMessage: string, time: string, chat_id: number | null }>({
    lastMessage: "",
    time: "",
    chat_id: null
  });

  const handleContactPress = async () => {
    await updateUnreadMessages(db, messageDetails!.chat_id!, 0);
    setUnread(0);
    
    let data = {
      name: name,
      phoneNo: phoneNo,
      id: id,
      profilePicture: image
    }
    router.push(`/chats/${encodeURIComponent(JSON.stringify(data))}`);
  };
  
  const getLastMessageDetails = async (id: number) => {
    const res: any = await getLastMessageFromDb(db, id);
    console.log("Last message: ",res)
    setMessageDetails({
      lastMessage: res.message_text,
      time: res.timestamp,
      chat_id: res.chat_id
    })
  }

  const getDetails = async () => {
    const res: any = await getChatDetails(db, id);
    console.log("Details: ",res);
    setUnread(res.unread_messages);
    getLastMessageDetails(res.last_message_id)
  }

  useFocusEffect(
    useCallback(() => {
      getDetails();
    }, [])
  )

  useEffect(() => {
    socket?.on("chat-message", async (messageData: { message: string; type: string; sent: boolean }) => {
      if (messageDetails?.chat_id !== null) {
        // Save message in Phone DB
        await insertMessageIntoDb(db, messageDetails?.chat_id, messageData.message, messageData.type, messageData.sent);
        setUnread((prevCount) => {
          const newCount = prevCount + 1;
          updateUnreadMessages(db, messageDetails!.chat_id!, newCount);
          
          return newCount; 
        });
        PlayIncomingMsg();
      }
    });

    return () => {
      socket?.off("chat-message");
    };
  }, [db, socket, messageDetails]);

  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity onPress={handleContactPress}>
      <View className='flex flex-row p-3 w-full'>
        <Image
          source={{ uri: image }}
          className='w-16 h-16 rounded-full'
          resizeMode='contain'
        />
        <View className='flex flex-row p-2'>
          <View className='flex w-1/2'>
            <Text className={`${colorScheme === "light" ? "text-black" : "text-white"}`}>{name}</Text>
            <Text className={`text-gray-500`}>{messageDetails.lastMessage}</Text>
          </View>
          <View className='flex items-center w-1/2'>
            <Text className={`text-sm text-gray-500`}>{formatDate(messageDetails.time)}</Text>
            {unRead > 0 && (
              <View className='flex items-center justify-center rounded-full bg-blue-500 w-7 h-7'>
                <Text className={`text-white`}>{unRead.toString()}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Chats;
