import {v2 as cloudinary} from "cloudinary";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

export const createStory = async(req,res) => {
    try {
        const {imageUrl} = req.body;
        let cloudinaryResponse = null;

        const user  = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        if(!imageUrl){
            return res.status(400).json({message:"add image"});
        }

        
        if (imageUrl) {
            cloudinaryResponse = await cloudinary.uploader.upload(imageUrl, { folder: "insta-stories" });
        }

        const newStory = await Story.create
        ({
            imageUrl:cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            userId:req.user._id,
            
        });

        user.story.push(newStory._id);

        await user.save();

        await newStory.save();

        res.status(201).json(newStory);
        
    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in story" , error.message)
    }
}

export const getStory = async(req,res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id)

        if(!user){        
            return res.status(400).json({message:"User not found"});    
        }

        const stories = await Story.find({userId:user._id}).populate("userId","_id name profilePic").sort({createdAt:-1});

        res.status(200).json(stories);
    }
    catch(error){
        res.status(500).json({message:error.message});
        console.log("error in story" , error.message)
    }
}