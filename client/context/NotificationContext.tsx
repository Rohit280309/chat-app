import React, { createContext, useContext, useState, useCallback } from 'react';
import { View } from 'react-native';
import Notification from '@/components/Notification';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationContextProps {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<
    { message: string; type: NotificationType }[]
  >([]);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    setNotifications((prev) => [...prev, { message, type }]);
  }, []);

  const closeNotification = useCallback((index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <View className="absolute top-16 left-0 right-0">
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            message={notification.message}
            type={notification.type}
            onClose={() => closeNotification(index)}
          />
        ))}
      </View>
    </NotificationContext.Provider>
  );
};
