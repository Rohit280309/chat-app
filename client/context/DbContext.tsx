import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from "expo-secure-store";
import { SQLiteDatabase } from 'expo-sqlite';
import { initializeDatabase } from '@/db/dbSetup';

const DbContext = createContext<DbContextType | null>(null);

export const DbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [db, setDb] = useState<SQLiteDatabase | null>(null);
    useEffect(() => {
        initializeDatabase()
        .then((res) => {
            setDb(res);
        }).catch(err => console.log(err));
    }, []);
    
    return (
        <DbContext.Provider value={{ db }}>
            {children}
        </DbContext.Provider>
    )
}

export const useDb = () => {
    const context = useContext(DbContext);
    if (!context) {
        throw new Error('useDb must be used within an AuthProvider');
      }
      return context;
}