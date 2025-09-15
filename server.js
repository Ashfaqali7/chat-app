import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import { connectDB } from './config/db.js';
import { Server } from 'socket.io';
import http from 'http';
//routes
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Chat App Backend is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {

    console.log(`User Connected: ${socket.id}`);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
    });
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });

});
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});