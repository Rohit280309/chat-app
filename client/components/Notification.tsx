import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  useEffect(() => {
    // Fade in the notification
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-close the notification after 3 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [fadeAnim, onClose]);

  return (
    <SafeAreaView>
      <Animated.View
        className={`${typeStyles[type]} rounded-lg p-4 shadow-lg`}
        style={{ opacity: fadeAnim }}
      >
        <View className='flex-row'>
          <View className='w-5/6 flex items-center justify-center'>
            <Text className="text-white font-semibold text-lg">{message}</Text>
          </View>
          <View className='w-1/6 flex items-end justify-center'>
            <TouchableOpacity onPress={onClose} className="absolute top-0 right-1 p-1">
              <Text className="text-white text-lg">X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Notification;
