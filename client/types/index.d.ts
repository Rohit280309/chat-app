interface ParsedDataType {
    name: string;
    phoneNo: string;
    dbId: string;
    id: number;
    lastMessage?: string;
    profilePicture?: string;
    about?: string;
    email?: string;
}

interface MessageType {
    message: string;
    type: string;
    sent: boolean;
    status: string | null;
}

interface DbContextType {
    db: SQLiteDatabase | null,
}

interface ContactProps {
    image: string;
    name: string;
    phoneNo: string;
    lastMessage?: string;
    time?: string;
    unRead?: number;
    id: number;
}