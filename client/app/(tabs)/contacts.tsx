import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import { getColor } from '@/utils'; // Adjust path as needed
import { useColorScheme } from '@/components/useColorScheme';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'expo-router';
import axios from '@/api/axios';
import { useNotification } from '@/context/NotificationContext';
import NoResultFound from '@/components/NoResultFound';

interface Contact {
  id: string;
  name?: string;
  phones?: Array<{ number: string }>;
}

const ContactsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const colorScheme = useColorScheme();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [searchText, setSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });

          if (data.length > 0) {
            // Filter out contacts with no phone numbers
            const filteredContacts = data
              .filter((contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0)
              .map((contact) => ({
                ...contact,
                phones: contact.phoneNumbers!.map((phone) => ({ number: phone.number })),
              }));

            // Remove duplicates based on phone number
            const uniqueContacts = filteredContacts.reduce((acc: Contact[], contact: any) => {
              const existingContact = acc.find((c) =>
                c.phones?.some((phone) => contact.phones?.some((p: any) => p.number === phone.number))
              );
              if (!existingContact) {
                acc.push(contact);
              }
              return acc;
            }, []);

            setContacts(uniqueContacts);
          }
        } else {
          Alert.alert('Permission required', 'You need to grant contacts permission to use this feature.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred while fetching contacts.');
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {

    if (contacts !== null) {

      const filteredContacts = contacts.filter((contact) => contact.name?.toLowerCase().includes(searchText.toLowerCase()));
      console.log(filteredContacts);
      setSearchResult(filteredContacts);
    }

  }, [searchText]);

  const getContactInitials = (name: string | undefined) => {
    if (name) {
      const names = name.split(' ');
      // console.log("Name: ", names.length > 1 ? `${names[0][0]}${names[1][0]}` : `${names[0][0]}${names[0][1]}`);
      return names.length > 1 ? `${names[0][0]}${names[1][0]}` : `${names[0][0]}${names[0][1]}`;
    }
    return '';
  };

  const checkUser = async (phoneNo: string): Promise<boolean> => {
    try {
      const res: any = await axios.get(`/check-user/${phoneNo}`);
      console.log(res.data.success);
      return res.data.success;
    } catch (error: any) {
      return false;
    }
  }

  const handleChatPress = async (phone: any, name: any) => {
    let phoneNo = phone.startsWith('+91') ? phone : `+91${phone.replace(/\s/g, '')}`;
    let data = {
      name: name,
      phoneNo: phoneNo,
      origin: "contacts"
    };

    const res = await checkUser(phoneNo);
    console.log(res);
    if (res) {
      router.push(`/chats/${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      showNotification("Tell user to install the app", "info");
    }
  }

  return (
    <View className="flex-1 p-4">
      <SearchBar title='Search for name...' searchText={searchText} setSearchText={setSearchText} />
      {
        searchText.length <= 0 ?
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const color = getColor(index);
              const initials = getContactInitials(item.name);
              return (
                <TouchableOpacity onPress={() => handleChatPress(item.phones?.[item.phones?.length - 1].number, item.name || "Unknown")}>
                  <View className="flex-row items-center mb-4 p-4 rounded-lg shadow-sm">
                    <View className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}`}>
                      <Text className={`${colorScheme === "light" ? "text-black" : "text-white"} text-black text-xl font-bold`}>{initials}</Text>
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className={`text-lg font-semibold ${colorScheme === "light" ? "text-black" : "text-white"}`}>{item.name || 'Unknown'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          :
            searchResult.length > 0 ?

          (
            <FlatList
              data={searchResult}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                const color = getColor(index);
                const initials = getContactInitials(item.name);
                return (
                  <TouchableOpacity onPress={() => handleChatPress(item.phones?.[item.phones?.length - 1].number, item.name || "Unknown")}>
                    <View className="flex-row items-center mb-4 p-4 rounded-lg shadow-sm">
                      <View className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}`}>
                        <Text className={`${colorScheme === "light" ? "text-black" : "text-white"} text-black text-xl font-bold`}>{initials}</Text>
                      </View>
                      <View className="ml-4 flex-1">
                        <Text className={`text-lg font-semibold ${colorScheme === "light" ? "text-black" : "text-white"}`}>{item.name || 'Unknown'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) :

          (
            <NoResultFound />
          )
      }
    </View>
  );
};

export default ContactsScreen;
