import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema(
    {
        aiConversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AiConversation",
            required: true,
        },
        sender : {
            type: String,
            enum : ["user", "ai"],
            required: true,
        },
        content :{
            type: String,
            required: true,
        }
    },
    {timestamps: true,}
)

const AiMessage = mongoose.model("AiMessage", aiMessageSchema);

export default AiMessage