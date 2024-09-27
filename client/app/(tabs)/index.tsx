import { View, Text, ScrollView, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useColorScheme } from '@/components/useColorScheme';
import SearchBar from '@/components/SearchBar';
import Img from "../../assets/images/icon.png";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useFocusEffect } from 'expo-router';
import Chats from '@/components/Chats';
import { useSocket } from '@/context/SocketContext';
import { useDb } from '@/context/DbContext';
import * as FileSystem from 'expo-file-system';
import { insertMessageIntoDb } from '@/db/messages.utils';
import NoResultFound from '@/components/NoResultFound';

const ChatScreen = () => {

  const colorScheme = useColorScheme();
  const { connect, socket } = useSocket();
  const { db } = useDb();
  const [chats, setChats] = useState<any>(null);
  const [refershing, setRefreshing] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any>(null);


  const deleteDatabase = async (dbName: string) => {
    const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

    try {
      const fileExists = await FileSystem.getInfoAsync(dbPath);

      if (fileExists.exists) {
        await FileSystem.deleteAsync(dbPath, { idempotent: true });
        console.log(`Database ${dbName} deleted successfully.`);
      } else {
        console.log(`Database ${dbName} does not exist.`);
      }
    } catch (error) {
      console.error(`Error deleting database ${dbName}:`, error);
    }
  };

  // Usage: call deleteDatabase with your database name
  // useEffect(() => {

  //   deleteDatabase("chatApp.db");

  // }, [])


  const getContacts = async () => {
    await db?.withTransactionAsync(async () => {
      // await db.execAsync('INSERT INTO users (dbId, name, email, phoneNo, profile_picture_url, about) VALUES ("first", "Rohit Kumbhar", "email@gmail.com", "+1234567890", "http://photo", "Hey there i am using chats")')
      // await db.execAsync('DROP table call_logs');
      // await db.execAsync('DELETE from messages');
    //   const res: any = await db.execAsync(`
    //     UPDATE messages 
    //     SET status = 'sent' 
    //     WHERE status IS NULL;
    // `);
      const result: any = await db?.getAllAsync('SELECT * FROM users');
      console.log('Count:', result);

      // const res: any = await db?.getAllAsync('SELECT * FROM chats');
      // console.log('Count:', res);

      setChats(result);
    });
  }

  useEffect(() => {
    connect();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getContacts();

    }, [])
  );

  useEffect(() => {

    // if (chats !== null) {
    // console.log(chats.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase())));
    // }
    if (chats !== null) {
      setSearchResult(chats.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase())));
    }

  }, [searchText])


  const onRefresh = async () => {
    setRefreshing(true);
    getContacts();
    setRefreshing(false)
  }


  return (
    <SafeAreaView className='h-screen'>
      <View>
        <SearchBar title='Search for name...' searchText={searchText} setSearchText={setSearchText} />
      </View>
      {
        searchText.length <= 0 ?
          (
            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <Chats image={item.profile_picture_url} phoneNo={item.phoneNo} id={item.id} name={item.name} />
                );
              }}

              refreshControl={<RefreshControl refreshing={refershing} onRefresh={onRefresh} />}
            />
          )
          :

          searchResult.length > 0 ?

            (
              <FlatList
                data={searchResult}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  return (
                    <Chats image={item.profile_picture_url} phoneNo={item.phoneNo} id={item.id} name={item.name} />
                  );
                }}

                refreshControl={<RefreshControl refreshing={refershing} onRefresh={onRefresh} />}
              />

            )
            :
            (
              <NoResultFound />
            )
      }

    </SafeAreaView>
  )
}

export default ChatScreen