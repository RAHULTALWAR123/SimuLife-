import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
    }, 
    isPaidPost: {
        type: Boolean,
        default: false
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            userProfilePic: {
                type: String,
            },
            name: {
                type: String,
            },
        }
    ],
    
},

    {timestamps: true,}

);

const Post = mongoose.model("Post", postSchema);

export default Post