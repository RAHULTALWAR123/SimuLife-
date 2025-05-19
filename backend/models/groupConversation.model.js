import mongoose from "mongoose";

const groupConversationSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      unique: true, // Ensure one conversation per group
    },
  },
  { timestamps: true }
);

const GroupConversation = mongoose.model("GroupConversation", groupConversationSchema);

export default GroupConversation;
