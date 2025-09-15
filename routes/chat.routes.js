import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { accessChat, fetchChats, deleteChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", authMiddleware, accessChat);   // start or fetch chat
router.get("/", authMiddleware, fetchChats);    // get all chats
router.delete("/:chatId", authMiddleware, deleteChat); // delete chat

export default router;