import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import Message from "../models/message.model.js";
export const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "UserId param not sent with request"
            })
        }
        let chat = await Chat.find({
            members: { $all: [req.user._id, userId] },
        }).populate("members", "-password")
            .populate("latestMessage");
        if (chat) return res.json(chat);
        chat = await Chat.create({
            members: [req.user._id, userId],
        });
        const fullChat = await Chat.findOne({ _id: chat._id }).populate(
            "members", "-password"
        );
        return res.status(201).json(fullChat);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({ members: req.user._id })
            .populate("members", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 }); // latest chat first

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) return res.status(404).json({ message: "Chat not found" });

        if (!chat.members.includes(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to delete this chat" });
        }

        await Message.deleteMany({ chat: chat._id });

        await chat.deleteOne();

        res.json({ message: "Chat deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};