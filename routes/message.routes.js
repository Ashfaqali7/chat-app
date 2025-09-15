import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sendMessage, getAllMessages, deleteMessage, markAsRead } from "../controllers/message.controller.js";

const router = express.Router();

// Send a new message
router.post("/", authMiddleware, sendMessage);

// Get all messages for a chat
router.get("/:chatId", authMiddleware, getAllMessages);

// Mark a message as read
router.put("/:messageId/read", authMiddleware, markAsRead);

// Delete a message
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;