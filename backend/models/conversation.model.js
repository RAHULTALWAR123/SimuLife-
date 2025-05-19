import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
		lastMessage: {
			text: String,
			sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			seen: {
				type: Boolean,
				default: false,
			},
		},
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;