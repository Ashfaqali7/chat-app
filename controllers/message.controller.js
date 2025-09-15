import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.js";

export const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            return res.status(400).json({
                message: "Content and chatId are required"
            });
        }

        const newMessage = {
            sender: req.user._id,
            content,
            chat: chatId
        };

        let message = await Message.create(newMessage);
        
        // Populate sender and chat details
        message = await message.populate("sender", "name avatar");
        message = await message.populate("chat");
        
        // Populate sender details in chat members
        await User.populate(message, {
            path: "chat.members",
            select: "name avatar email"
        });

        // Update the latest message in the chat
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({
                message: "Chat ID is required"
            });
        }

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name avatar email")
            .populate("chat")
            .sort({ createdAt: 1 }); // Oldest messages first

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if user is the sender of the message
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this message" });
        }

        await message.deleteOne();

        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};