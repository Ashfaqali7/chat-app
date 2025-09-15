import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sendMessage, getAllMessages, deleteMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Send a new message
router.post("/", authMiddleware, sendMessage);

// Get all messages for a chat
router.get("/:chatId", authMiddleware, getAllMessages);

// Delete a message
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;