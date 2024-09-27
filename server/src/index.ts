import express from "express";
import cors from "cors";
import { connect } from "./config/db";
import { server } from "./services/socket.server";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import path from "path";

const PORT = parseInt(process.env.PORT!, 10);
const SOCKET_PORT = parseInt(process.env.SOCKET_PORT!, 10);
const HOST = process.env.HOST!;
const app = express();
connect();

app.use(express.json());
app.use(cors());

app.use("/api", authRouter);
app.use("/api", userRouter);

app.use("/logo", express.static(path.join(__dirname, "uploads/profileImages")));

app.listen(PORT, HOST, () => {
    console.log(`App listening on http://${HOST}:${PORT}`);
});

server.listen(SOCKET_PORT, HOST, () => {
    console.log(`Socket server running on ws://${HOST}:${SOCKET_PORT}`)
});