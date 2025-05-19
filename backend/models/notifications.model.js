import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
    },
    groupRecipients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    type: {
        type: String,
        enum:["like", "comment", "follow","chat", "groupChat"],
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    message: {
        type: String
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification