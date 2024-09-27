import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const app = express();
export const server = createServer(app);
export const io = new Server(server);

interface CustomSocket extends Socket {
    user?: string;
}

const userSocketMap = new Map<string, string>();

io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.query.token as string;
    console.log(token);

    if (!token) {
        console.error('No token provided');
        return next(new Error('No token provided'));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
        if (err) {
            console.error('Authentication error:', err.message);
            return next(new Error('Authentication error'));
        }

        const userPhoneno = decoded.user.phoneNo;
        socket.user = userPhoneno;
        userSocketMap.set(userPhoneno, socket.id);
        console.log(`User connected: ${userPhoneno} with socket ID ${socket.id}`);
        next();
    });
});

io.on("connection", (socket: CustomSocket) => {
    socket.on("chat-message", (msg) => {
        const { receiver, message, type, sent } = msg;
        const receiverSocketId = userSocketMap.get(receiver);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("chat-message", { sender: socket.user, message: message, type: type, sent: sent });
        } else {
            console.error(`No active socket found for receiver ${receiver}`);
        }
    });

    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id}, ${socket.user}. Reason: ${reason}`);
        if (socket.user) {
            userSocketMap.delete(socket.user);
            console.log(`Removed ${socket.user} from userSocketMap`);
        }
    });
});

