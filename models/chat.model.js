import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    isGroup: { type: Boolean, default: false },
    name: { type: String, trim: true },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },

}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);