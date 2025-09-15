import Chat from "../models/chat.model.js";
import User from "../models/user.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

export const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "UserId param not sent with request"
            });
        }

        let chat = await Chat.findOne({
            members: { $all: [req.user._id, userId] },
        }).populate("members", "-password")
            .populate("latestMessage");

        // Check if chat exists
        if (chat) {
            return res.json(chat);
        }

        // Create new chat if none exists
        const createdChat = await Chat.create({
            members: [req.user._id, userId],
        });

        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "members", "-password"
        );

        return res.status(201).json(fullChat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({ members: req.user._id })
            .populate("members", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) return res.status(404).json({ message: "Chat not found" });

        // Check if user is part of the chat
        if (!chat.members.map(id => id.toString()).includes(req.user._id.toString())) {
            return res.status(403).json({ message: "Not authorized to delete this chat" });
        }

        // Delete all messages in the chat
        await Message.deleteMany({ chat: chat._id });

        // Delete the chat
        await chat.deleteOne();

        res.json({ message: "Chat deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};