import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image, FlatList, TouchableOpacity, NativeScrollEvent, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/components/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { formatString, PlayActiveIncomingMsg, PlayMsgSent } from '@/utils';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Message from '@/components/Message';
import axios from '@/api/axios';
import { useDb } from '@/context/DbContext';
import { insertUserIntoDb } from '@/db/users.utils';
import { SQLiteDatabase } from 'expo-sqlite';
import { createNewChat, getCurrentChatId } from '@/db/chats.utils';
import { getAllMessagesFromDb, getMessagesFromDb, insertMessageIntoDb } from '@/db/messages.utils';
import { useSocket } from '@/context/SocketContext';
import { NativeSyntheticEvent } from 'react-native';

const ChatScreen = () => {

  const { data }: any = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [text, setText] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedDataType | null>(null);
  const { db }: { db: SQLiteDatabase } = useDb();
  const { socket }: { socket: any } = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [chatId, setChatId] = useState<number | null>(null);

  const [scrollY, setScrollY] = useState<number>(0);
  const [isUserAtBottom, setIsUserAtBottom] = useState<boolean>(true);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setScrollY(yOffset);
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    // Check if user is at the bottom
    if (contentHeight - (yOffset + layoutHeight) < 10) {
      setIsUserAtBottom(true);
    } else {
      setIsUserAtBottom(false);
    }

    if (yOffset < 0 && !loadingMore) {
      setLoadingMore(true);
      handleLoadMore();
    }

  };


  const scrollRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const getAllMessages = async (id: number) => {
    const fetchedMessages = await getAllMessagesFromDb(db, id);
    const formattedMessages = fetchedMessages.map((item: any) => ({
      message: item.message_text,
      type: item.message_type,
      sent: item.sent,
    }));
    
    setMessages(formattedMessages);
  };
  
  const fetchMessages = async (id: number) => {
    const newMessages = await getMessagesFromDb(db, id, offset, 15);

    const formattedMessages = newMessages.map((item: any) => ({
      message: item.message_text,
      type: item.message_type,
      sent: item.sent,
      status: item.status
    }));
    console.log("Formatted Msgs: ", formattedMessages);
    setMessages((prevMessages) => [...formattedMessages, ...prevMessages]);
  };

  useEffect(() => {
    if (chatId !== null) {
      fetchMessages(chatId!);
    }
  }, [chatId]);

  const handleLoadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setOffset((prevOffset) => {
        if (chatId !== null) {
          fetchMessages(chatId!);
        }
        return prevOffset + 10
      }); // Load the next 10 messages
      setLoadingMore(false);
    }
  };


  const getContactDataAndUpdate = async (parsedData: ParsedDataType) => {
    try {
      const res = await axios.get(`/get-user/${parsedData?.phoneNo}`);
      if (res.data.success) {
        const updatedData = {
          ...parsedData,
          profilePicture: res.data.user.profilePicture,
          dbId: res.data.user._id,
          about: res.data.user.about,
          email: res.data.user.email,
        };
        setParsedData(updatedData);

        const insertedUserId: any = await insertUserIntoDb(db, updatedData);
        const insertedChatId: any = await createNewChat(db, insertedUserId);
        setChatId(insertedChatId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentChat = async (id: number) => {
    const res: any = await getCurrentChatId(db, id);
    setChatId(res);
    // getAllMessages(res);
    // fetchMessages(res);
  }

  useEffect(() => {
    if (data) {
      const parsedData = JSON.parse(decodeURIComponent(data));
      setParsedData(parsedData);
      if (parsedData?.origin === "contacts") {
        getContactDataAndUpdate(parsedData);
      } else {
        getCurrentChat(parsedData?.id);
      }
    }
  }, [data]);

  // useEffect(() => {
  //   if (messages.length > 0) {
  //     scrollRef.current?.scrollToEnd({ animated: true });
  //   }
  // }, [messages]);

  // Receive messages
  useEffect(() => {
    socket.on("chat-message", async (messageData: { message: string; type: string; sent: boolean, status: string | null }) => {
      if (chatId !== null) {
        await insertMessageIntoDb(db, chatId, messageData.message, messageData.type, messageData.sent);
        setMessages((prevMessages) => [...prevMessages, messageData]);
        PlayActiveIncomingMsg();
      }
    });

    return () => {
      socket.off("chat-message");
    };
  }, [chatId, db, socket]);

  // useEffect(() => {
  //   if (messages.length > 0 && !isUserAtBottom) {
  //     scrollRef.current?.scrollToEnd({ animated: true });
  //   }
  // }, [messages]);

  const sendMessage = ({ message, type, sent, status }: MessageType) => {
    if (!message.trim()) return;

    if (messages.length > 0 && !isUserAtBottom) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }

    setMessages((prevMessages) => [...prevMessages, { message, type, sent, status }]);
    insertMessageIntoDb(db, chatId!, message, type, sent);

    socket.emit("chat-message", {
      receiver: parsedData?.phoneNo,
      message: message
    });

    PlayMsgSent();

    setText("");
  }

  const renderLoadingSpinner = () => {
    if (!loadingMore) return null;

    return (
      <View className="flex justify-center items-center py-4">
        <ActivityIndicator size="large" color={colorScheme === 'light' ? '#1B72C0' : '#A2C9FF'} />
        <Text className={`${colorScheme === "light" ? "text-black" : "text-white"} mt-2`}>
          Loading messages...
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className={`${colorScheme === "light" ? "bg-activeTabLight" : "bg-[#0E181E]"} h-full`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='h-full'
      >
        <View className='flex flex-row items-center w-full p-4'>
          <View className='flex flex-row items-center w-1/2 gap-5'>
            <Pressable onPress={() => router.back()}><AntDesign name="arrowleft" size={24} color={colorScheme === "light" ? "black" : "white"} /></Pressable>
            <Pressable onPress={() => router.push(`/profile/${parsedData?.phoneNo}`)} className='flex flex-row gap-2'>
              <Image source={{ uri: parsedData?.profilePicture }} resizeMode='contain' className={`w-9 h-9 border shadow-xl ${colorScheme === "light" ? "border-black shadow-black" : "border-white shadow-white"} rounded-full`} />
              <Text className={`text-3xl font-semibold ${colorScheme === "light" ? "text-black" : "text-white"}`}>{parsedData?.name ? formatString(parsedData!.name, 10) : ""}</Text>
            </Pressable>
          </View>
          <View className='flex flex-row items-center justify-end gap-5 w-1/2'>
            <Ionicons name="call-outline" size={24} color={colorScheme === "light" ? "black" : "white"} />
            <Feather name="video" size={25} color={colorScheme === "light" ? "black" : "white"} />
            <Entypo name="dots-three-vertical" size={20} color={colorScheme === "light" ? "black" : "white"} />
          </View>
        </View>
        {/* <ScrollView
          ref={scrollViewRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(contentWidth, contentHeight) => {
            // Only scroll to the bottom when a new message is added, not when loading older messages
            if (!loadingMore && isUserAtBottom) {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }
          }}
        >
          {messages.map((item, index) => (
            <Message key={index} message={item.message} type={item.type} sent={item.sent} />
          ))}
        </ScrollView> */}

        <FlatList
          data={messages}
          // onScroll={onScroll}
          ref={scrollRef}
          className='flex-1'
          keyExtractor={(item, index) => `${item.message}-${index}`}
          renderItem={({ item }) => (
            <Message message={item.message} type={item.type} sent={item.sent} status={item.status} />
          )}
          onContentSizeChange={(contentWidth, contentHeight) => {
            if (!loadingMore && isUserAtBottom) {
              scrollRef.current?.scrollToEnd({ animated: true });
            }
          }}
          ListHeaderComponent={renderLoadingSpinner}
          refreshing={loadingMore}
          onRefresh={handleLoadMore}
          
        />

        <View className={`flex flex-row py-3`}>
          <View className='w-1/5 gap-2 flex flex-row justify-center items-center'>
            <FontAwesome6 name="camera" size={24} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"} />
            <MaterialIcons name="image" size={28} color={colorScheme === "light" ? "#1B72C0" : "#A2C9FF"} />
          </View>
          <View className='w-4/5 gap-2 flex flex-row items-center'>
            <View className={`w-4/5 ${colorScheme === "light" ? "bg-white" : "bg-[#1E2A32]"} rounded-full p-2`}>
              <TextInput
                className={`ml-2 ${colorScheme === "light" ? "text-black" : "text-white"}`}
                value={text}
                onChangeText={setText}
                placeholder="Message"
                placeholderTextColor={`${colorScheme === "light" ? "#74777F" : "white"}`}
              />
            </View>
            <View className={`w-1/5`}>
              <View className={`w-10 h-10 rounded-full flex justify-center items-center ${colorScheme === "light" ? "bg-customBlue1" : "bg-customBlue2"}`}>
                <TouchableOpacity onPress={() => sendMessage({ message: text, type: "text", sent: true, status: "unsend" })}>
                  <Ionicons name="send" size={20} color={colorScheme === "light" ? "white" : "black"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen;
