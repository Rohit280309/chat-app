import { SQLiteDatabase } from "expo-sqlite";
import { updateLastMessageId } from "./chats.utils";

export const insertMessageIntoDb = async (db: SQLiteDatabase, chatId: number, message: string, type: string, sent: boolean) => {
    let insertedMessageId = null;

    await db?.withTransactionAsync(async () => {
        const res = await db?.runAsync(`
                INSERT INTO messages (chat_id, message_text, sent, message_type)
                VALUES (${chatId}, "${message}", ${sent}, "${type}")
            `);
        console.log("Res:", res.lastInsertRowId);
        await updateLastMessageId(db, chatId, res.lastInsertRowId);
    });
}

export const getAllMessagesFromDb = async (db: SQLiteDatabase, chatId: number) => {
    let messages: any = [];
    await db?.withTransactionAsync(async () => {
        const result: any = await db?.getAllAsync(`SELECT * from messages WHERE chat_id=${chatId}`);
        messages = result;
    });

    return messages;
}

export const getMessagesFromDb = async (db: SQLiteDatabase, chatId: number, offset: number = 0, limit: number = 20) => {
    let messages: any = [];
    const result: any = await db?.getAllAsync(
        `SELECT * from messages WHERE chat_id=${chatId} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
    );
    messages = result.reverse();

    return messages;
}


export const getLastMessageFromDb = async (db: SQLiteDatabase, id: number) => {
    try {
        const result = await db?.getFirstAsync(`SELECT * from messages WHERE id=${id}`);
        return result;
    } catch (error: any) {
        console.error("Error getting message: ", error);
        return null;
    }
} 
