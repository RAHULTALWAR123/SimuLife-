import mongoose from "mongoose";

const aiConversationSchema = new mongoose.Schema(
    {
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    companionId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Companion",
        required: true,
    },
},
{timestamps: true,}
)

const AIConversation = mongoose.model("AIConversation", aiConversationSchema);

export default AIConversation