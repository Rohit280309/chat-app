import { SQLiteDatabase } from "expo-sqlite";

export const createNewChat = async (db: SQLiteDatabase, id: number) => {
    let insertedChatId = null;

    await db?.withTransactionAsync(async () => {
        // Insert the new chat with the participant_id
        const res = await db?.runAsync(`
            INSERT INTO chats (participant_id) 
            VALUES (${id})
        `);

        // const result: any = await db?.getFirstAsync(`SELECT id from chats WHERE participant_id="${id}"`);
        // insertedChatId = result?.id;
        insertedChatId = res.lastInsertRowId;
    });

    return insertedChatId;
}

export const getCurrentChatId = async (db: SQLiteDatabase, id: number) => {
    let chatId = null;
    await db?.withTransactionAsync(async () => {
        const result: any = await db?.getFirstAsync(`SELECT * from chats WHERE participant_id=${id}`);
        console.log("Result: ", result);
        chatId = result?.id;
    })

    return chatId;
}

export const getChatDetails = async (db: SQLiteDatabase, id: number) => {
    try {
        const result = await db.getFirstAsync(`SELECT * from chats WHERE participant_id = ${id}`);
        console.log("Result: ", result);
        return result;
    } catch (error: any) {
        console.error("Error getting details:", error);
        return null;
    }
};


export const updateLastMessageId = async (db: SQLiteDatabase, chatId: number, messageId: number) => {
    try {
        await db.execAsync(`
                UPDATE chats SET last_message_id=${messageId} WHERE id=${chatId}    
            `);
    } catch (error) {
        console.error("Error updating last message ID:", error);
    }
};

export const updateUnreadMessages = async (db: SQLiteDatabase, chatId: number, count: number) => {
    try {
        console.log(chatId, count);
        await db?.withTransactionAsync(async () => {
            await db?.execAsync(`
                UPDATE chats SET unread_messages=${count} WHERE id=${chatId}
            `)
        });
    } catch (error: any) {
        console.error("Error updating unread message ID:", error);
    }
}


