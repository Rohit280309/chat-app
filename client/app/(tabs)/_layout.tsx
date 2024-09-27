import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

import "../global.css";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome6>['name'];
  color: string;
  backgroundColor: string; 
  active: boolean;
  colorScheme: string | null | undefined,
}) {
  return <View className={`${props.active ? `${props.colorScheme === "dark" ? "bg-activeTabDark" : "bg-activeTabLight"}` : "transparent"} w-16 flex items-center justify-center rounded-full`}><FontAwesome6 size={15} style={{ marginBottom: -3, padding: 8 }} name={props.name} color={props.color} /></View>;
}
 
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true), 
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].tabBarColor
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="house" color={color} colorScheme={colorScheme} backgroundColor={Colors[colorScheme ?? 'light'].activeBackground} active={focused} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="users" color={color} colorScheme={colorScheme} backgroundColor={Colors[colorScheme ?? 'light'].activeBackground} active={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="gear" color={color} colorScheme={colorScheme} backgroundColor={Colors[colorScheme ?? 'light'].activeBackground} active={focused} />,
        }}
      />
    </Tabs>
  );
}
