import Group from "../models/group.model.js";
import {v2 as cloudinary} from "cloudinary";
import GroupConversation from "../models/groupConversation.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notifications.model.js";

export const createGroup = async (req, res) => {
    try {
        const {name , logo , members} = req.body
        let cloudinaryResponse = null;

        if (logo) {
            cloudinaryResponse = await cloudinary.uploader.upload(logo, { folder: "insta-groups" });
        }

        if (!name || !Array.isArray(members) || !members === 0) {
            return res.status(400).json({ message: "Please provide a group name and at least one member." });
        }

        const newGroup = await Group.create({
            name,
            logo : cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            owner : req.user._id,
            members
        });

        const populatedGroup = await Group.findById(newGroup._id).populate("owner","_id name profilePic");

        res.status(201).json(populatedGroup);


    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in groups" , error.message)
    }
};


export const groupConvo = async (req, res) => {
    try {
        const { id } = req.params;

        const group = await Group.findById(id).populate('members', '_id name profilePic'); // Populate members here

        if (!group) {    
            return res.status(400).json({ message: "Group not found" });    
        }

        const existingConvo = await GroupConversation.findOne({ group: group._id })
            .populate({
                path: 'group',
                select: 'name members owner logo',
                populate: { path: 'members owner', select: '_id name profilePic' } // Correct nested population
            });

        if (existingConvo) {
            return res.status(200).json(existingConvo);
        }

        const newConvo = await GroupConversation.create({ group: group._id });

        const populatedConvo = await GroupConversation.findById(newConvo._id)
            .populate({
                path: 'group',
                select: 'name members owner logo',
                populate: { path: 'members owner', select: '_id name profilePic' } // Ensure members are populated
            });

        res.status(201).json(populatedConvo);

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in groups:", error.message);
    }
};


export const groupSendMessage = async (req, res) => {
    try {
        const {text,img} = req.body;
        let cloudinaryResponse = null;

        if (img) {
            cloudinaryResponse = await cloudinary.uploader.upload(img, { folder: "insta-groups" });
        }

        if(!text && !img){
            return res.status(400).json({message:"add message"});
        }

        const {id} = req.params;

        const convo = await GroupConversation.findById(id);

        if(!convo){    
            return res.status(400).json({message:"Group conversation not found"});    
        }

        const group = await Group.findById(convo.group);

        if(!group){    
            return res.status(400).json({message:"Group not found"});    
        }

        const user = await User.findById(req.user._id);

        if(!user){    
            return res.status(400).json({message:"User not found"});    
        }

        const newMessage = await GroupMessage.create({
            conversationId:convo._id,
            sender:user._id,
            text:text,
            img : cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : ""
        })

        await Notification.create({
            sender:user._id,
            groupRecipients:group.members.filter(memberId => memberId.toString() !== user._id.toString()),
            type:"groupChat",
            group:group._id,
            message:`${user.name} sent a new message in "${group.name}"`
        })

        const populatedMessage = await GroupMessage.findById(newMessage._id).populate("sender","_id name profilePic");

        res.status(201).json(populatedMessage);


    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in groups" , error.message)
    }
}



export const groupGetMessage = async (req, res) => {
    try {
        const {id} = req.params;

        const convo = await GroupConversation.findById(id);

        if(!convo){    
            return res.status(400).json({message:"Group conversation not found"});    
        }

        const messages = await GroupMessage.find({conversationId:id}).populate("sender","_id name profilePic").sort({createdAt:1});

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in groups" , error.message)
    }
}

export const getGroups = async(req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        if(!user){    
            return res.status(400).json({message:"User not found"});    
        }

        const groups = await Group.find({members : user._id}).populate("owner","_id name profilePic");

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in groups" , error.message)
    }
}


export const joinGroup = async(req, res) => {
    try {
        const {id} = req.body;
        const userId = req.user._id;

        // First check if group exists without population
        const group = await Group.findById(id);
        if(!group) {    
            return res.status(400).json({message:"Group not found"});    
        }


        // Check if user exists
        const user = await User.findById(userId);
        if(!user) {    
            return res.status(400).json({message:"User not found"});    
        }

        // Prevent owner from being added as member
        if(group.owner.equals(userId)) {
            return res.status(400).json({message:"Owner cannot join as member"});
        }

        // Check if user is already a member
        if(group.members.some(member => member.equals(userId))) {
            return res.status(400).json({message:"User already in group"});
        }

        // Add new member
        group.members.push(userId);
        await group.save();

        // Return group with populated owner but no member population
        const updatedGroup = await Group.findById(group._id)
            .populate('owner', '_id name profilePic')
            .select('-members'); // Exclude members array from response

        res.status(200).json(updatedGroup);
    }
    catch(error) {
        res.status(500).json({message:error.message});
        console.log("Error in joinGroup:", error.message);
    }
}


export const leaveGroup = async(req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user._id;


        const group = await Group.findById(id);
        if(!group) {    
            return res.status(400).json({message:"Group not found"});    
        }

        const user = await User.findById(userId);
        if(!user) {    
            return res.status(400).json({message:"User not found"});    
        }

        if(!group.members.some(member => member.equals(userId))) {
            return res.status(400).json({message:"User not in group"});
        }

        if(group.owner.equals(userId)) {
            return res.status(403).json({ 
                message: "Group owner cannot leave group" 
            });
        }

        group.members = group.members.filter(member => !member.equals(userId));
        await group.save();

        res.status(200).json({ 
            success: true,
            message: "Successfully left group",
            groupId: group._id
        });

    }catch(error) {
        res.status(500).json({message:error.message});
        console.log("Error in leaveGroup:", error.message);
    }
}
