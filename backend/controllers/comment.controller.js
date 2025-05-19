import mongoose from "mongoose";
import Post from "../models/post.model.js";
import Notification from "../models/notifications.model.js";

export const sendComment = async(req, res) => {
    try {
        const {id} = req.params;
        const {text} = req.body;

        if(!text || text.trim() === "") return res.status(400).json({message:"Add comment"});

        const post  = await Post.findById(id).populate("owner" , "_id name username profilePic");

        if(!post) return res.status(400).json({message:"Post not found"});

        post.comments.push({text:text , userId:req.user._id , userProfilePic:req.user.profilePic , name:req.user.name});

        await Notification.create({
            recipient: post.owner._id,
            sender : req.user._id,
            type : "comment",
            post : id,
            message : `${req.user.name} commented : "${text}" on your post : "${post.caption}"`
        })

        await post.save();

        res.status(200).json({
            Comments : {
                userId:req.user._id,
                name:req.user.name,
                userProfilePic:req.user.profilePic,
                text:text,
                postId:id
            },
            postComment : {
                _id : post._id,
                caption : post.caption,
                owner : post.owner,
                
            }
        });


    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}

export const getComment = async(req, res) => {
    try {
        const {id} = req.params;
        const post  = await Post.findById(id);

        if(!post) return res.status(400).json({message:"Post not found"});

        res.status(200).json(post.comments);    

    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}