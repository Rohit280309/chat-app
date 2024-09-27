import * as SQLite from 'expo-sqlite';

export const initializeDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('chatApp.db');

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dbId TEXT,
                name TEXT NOT NULL,
                email TEXT,
                phoneNo TEXT,
                profile_picture_url TEXT,
                about INTEGER
        );`
    );

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participant_id INTEGER NOT NULL, -- This will store the ID of the person you're chatting with
            last_message_id INTEGER,
            unread_messages INTEGER DEFAULT 0,
            FOREIGN KEY (participant_id) REFERENCES users(id),
            FOREIGN KEY (last_message_id) REFERENCES messages(id)
        );`
    );

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER NOT NULL,
            message_text TEXT,
            sent BOOLEAN NOT NULL, -- true if sent by the phone owner, false if received
            status TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            message_type TEXT DEFAULT 'text',
            FOREIGN KEY (chat_id) REFERENCES chats(id)
        );`
    );


    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS media_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_url TEXT NOT NULL,
                file_type TEXT NOT NULL,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
    );

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS call_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                caller_id INTEGER NOT NULL,
                receiver_id INTEGER NOT NULL,
                call_start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                call_end_time DATETIME,
                call_type TEXT NOT NULL,
                FOREIGN KEY (caller_id) REFERENCES users(id),
                FOREIGN KEY (receiver_id) REFERENCES users(id)
        );`
    );
    
    return db;
};


