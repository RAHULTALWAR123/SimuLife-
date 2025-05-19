import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notifications.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";

export const startConversation = async (req, res) => {
    try {
        const { id } = req.params; // ID of the other user
        const userId = req.user._id; // Current logged-in user

        const otherUser = await User.findById(id);
        if (!otherUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check conversation in both directions
        const convoExists = await Conversation.findOne({
            $or: [
                { senderId: userId, receiverId: id }, 
                { senderId: id, receiverId: userId }
            ]
        })
        .populate("senderId", "_id name username profilePic")
        .populate("receiverId", "_id name username profilePic");

        // If conversation exists, return it
        if (convoExists) {
            return res.status(200).json({
                conversationId: convoExists._id,
                otherUser: convoExists.senderId._id.toString() === userId.toString()
                    ? convoExists.receiverId
                    : convoExists.senderId,
                lastMessage : convoExists.lastMessage
            });
        }

        // Create new conversation if it doesn't exist
        const newConvo = await Conversation.create({
            senderId: userId,
            receiverId: id
        });

        const populatedConvo = await Conversation.findById(newConvo._id)
            .populate("senderId", "_id name username profilePic")
            .populate("receiverId", "_id name username profilePic");

        return res.status(200).json({
            message: "Conversation started successfully",
            conversationId: populatedConvo._id,
            otherUser: populatedConvo.receiverId._id.toString() === userId.toString()
                ? populatedConvo.senderId
                : populatedConvo.receiverId,
            lastMessage : populatedConvo.lastMessage
        });

    } catch (error) {
        console.error("Error in messages:", error.message);
        res.status(500).json({ error: error.message });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const {text,img} = req.body;
        let cloudinaryResponse = null;
        
        if(img) {
            cloudinaryResponse = await cloudinary.uploader.upload(img, { folder: "insta-messages" });
        }

        // if(!text || !img){
        //     return res.status(400).json({message:"add fields"});
        // }
        

        const {id} = req.params;

        const otherUser = await User.findById(id);

        if(!otherUser){
            return res.status(400).json({message:"User not found"});
        }

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const convo = await Conversation.findOne({
            $or: [
                { senderId: req.user._id, receiverId: id }, 
                { senderId: id, receiverId: req.user._id }
            ]
        });

        if(!convo){
            return res.status(400).json({message:"Conversation not found"});
        }

        // if(convo.senderId.toString() !== user._id.toString()){
        //     return res.status(400).json({message:"Unauthorized"});
        // }

        const newMessage = await Message.create({
            conversationId:convo._id,
            sender:user._id,
            text:text,
            img:cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : ""
        });

        await Notification.create({
            sender:user._id,
            recipient:otherUser._id,
            type:"chat",
            message:`${user.name} sent you a message`
        })

        convo.lastMessage = {
            text:text,
            sender:user._id
        };

        await convo.save();
        await newMessage.save();

        res.status(201).json({
            message:"message sent successfully",
            newMessage:{
                _id:newMessage._id,
                conversationId:newMessage.conversationId,
                text:newMessage.text,
                senderId:newMessage.sender,
                img:newMessage.img
            },
            lastMessage:{
                text:convo.lastMessage.text,
                senderId:convo.lastMessage.sender
            }

        });

    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in messges" , error.message)
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id} = req.params;

        const convo = await Conversation.findById(id);

        if(!convo){
            return res.status(400).json({message:"Conversation not found"});
        }



        const messages = await Message.find({conversationId:id}).sort({createdAt:1});

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in messges" , error.message)
    }
}

export const deleteChat = async (req, res) => {
    try {
        const {id} = req.params;
        const otherUser = await User.findById(id);

        if(!otherUser){
            return res.status(400).json({message:"User not found"});
        }

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const convo = await Conversation.findOne({
            $or: [
                { senderId: req.user._id, receiverId: id }, 
                { senderId: id, receiverId: req.user._id }
            ]
        });

        if(!convo){
            return res.status(400).json({message:"Conversation not found"});
        }

        const messages = await Message.find({conversationId:convo._id}).sort({createdAt:1});

        await Message.deleteMany({conversationId:convo._id});
        await Conversation.deleteOne({_id:convo._id});

        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in messges" , error.message)
    }

}    