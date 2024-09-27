import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from "expo-secure-store";
import { Socket, io } from 'socket.io-client';

interface SocketContextType {
  connect: () => void;
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const checkToken = async () => {
      const credentials = await SecureStore.getItemAsync("token");
      if (credentials) {
        setToken(credentials);
      }
    };
    checkToken();
  }, []);

  const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL!;

  const connect = () => {
    // console.log("Connection url:", `${SOCKET_URL}?${token}`);
    const socketConnection = io(`${SOCKET_URL}?token=${token}`);
    if (socketConnection) {
      setSocket(socketConnection);
    }
  }

  return (
    <SocketContext.Provider value={{ socket, connect }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within an SocketProvider');
  }
  return context;
}