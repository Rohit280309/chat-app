import { SQLiteDatabase } from "expo-sqlite";

export const insertUserIntoDb = async (db: SQLiteDatabase, updatedData: ParsedDataType) => {
    console.log(updatedData?.email);
    let insertedUserId = null;

    await db?.withTransactionAsync(async () => {
        await db?.execAsync(`
      INSERT INTO users (dbId, name, email, phoneNo, profile_picture_url, about) 
      VALUES ("${updatedData?.dbId}", "${updatedData?.name}", "${updatedData?.email}", "${updatedData?.phoneNo}", 
      "${updatedData?.profilePicture}", "${updatedData?.about}")
    `);

        const result: any = await db?.getFirstAsync(`SELECT id from users WHERE phoneNo="${updatedData.phoneNo}"`);
        insertedUserId = result?.id;
    });

    return insertedUserId;
}
