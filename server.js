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
// Improve CORS configuration for dev and prod
const allowedOrigin = process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : (process.env.FRONTEND_URL || "http://localhost:5173");
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));
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
        origin: allowedOrigin,
        methods: ["GET", "POST"],
        credentials: true
    },
});
io.on("connection", (socket) => {

    console.log(`User Connected: ${socket.id}`);

    // Track user online status
    socket.on("user_connected", async (userId) => {
        try {
            // Update user status to online
            const User = (await import('./models/user.js')).default;
            await User.findByIdAndUpdate(userId, { status: "online" });
            // Broadcast to all users that this user is online
            socket.broadcast.emit("user_online", userId);
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    });

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        // Emit to specific room instead of all users
        socket.to(data.chatId).emit("receive_message", data);
    });

    socket.on("typing", (data) => {
        socket.to(data.chatId).emit("user_typing", data);
    });

    socket.on("disconnect", async () => {
        console.log("❌ Client disconnected:", socket.id);
        // Note: To fully implement offline status, we would need to track which user belongs to which socket
        // This would require a more complex mapping of sockets to users
    });

});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});