import Post from "../models/post.model.js";
import {v2 as cloudinary} from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notifications.model.js";

export const createPost = async (req, res) => {
    try{
        const {caption,image,isPaidPost} = req.body;

        const user  = await User.findById(req.user._id);

        if(!user){    
            return res.status(400).json({message:"User not found"});    
        }

        let cloudinaryResponse = null;

        if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "insta-posts" });
		}

        if(!caption || !image){
            return res.status(400).json({message:"add caption and image"});
        }


        const newPost = await Post.create({
            caption,
            image : cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            isPaidPost : isPaidPost || false,
            owner:req.user._id 
        });

        if(isPaidPost){
            user.paidPosts.push(newPost._id);
        }

        await newPost.save();

        await user.save();

        res.status(201).json(newPost);

    }catch(error){
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}; 


export const getFeed = async (req, res) => {
    try {
        const user  = await User.findById(req.user._id);

        if(!user){    
            return res.status(400).json({message:"User not found"});    
        }

        const following = user.following;

        const posts = await Post.find({ $or: [{ owner: { $in: following } }, { owner: user._id }] }).sort({ createdAt: -1 }).populate("owner", "_id name username profilePic");

        if(!posts){
            return res.status(400).json({message:"Posts not found"});
        }

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}


export const userPosts = async (req, res) => {
    try {
        const {id} = req.params;

        const user  = await User.findById(id);

        if(!user){    
            return res.status(400).json({message:"User not found"});    
        }

        const posts = await Post.find({owner:id, isPaidPost : false}).sort({ createdAt: -1 }).populate("owner", "_id name username profilePic");

        res.status(200).json(posts);


    }
    catch(error){
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}

export const getPaidUserPosts  = async (req, res) => {
    try {
        const {id} = req.params;

        const user  = await User.findById(id);

        if(!user){    
            return res.status(400).json({message:"User not found"});    
        }

        const posts = await Post.find({owner:id , isPaidPost : true}).sort({ createdAt: -1 }).populate("owner", "_id name username profilePic");

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}


export const likeUnlike = async (req, res) => {
    try{
        const {id} = req.params;
        const user  = await User.findById(req.user._id);

        if(!user){    
            return res.status(400).json({message:"User not found"});    
        }

        const post = await Post.findById(id);

        if(!post){
            return res.status(400).json({message:"Post not found"});
        }

        if(post.likedBy.includes(user._id)){
            await Post.findByIdAndUpdate(id , {$pull: {likedBy : user._id}})

            await Notification.findOneAndDelete({
                post : id,
                recipient : post.owner._id,
                type : "like",
                sender : user._id
            })
        }
        else{
            await Post.findByIdAndUpdate(id , {$push: {likedBy : user._id}})

                await Notification.create({
                    recipient: post.owner._id,
                    sender: user._id,
                    type: "like",
                    post: id,
                    message: `${user.name} liked your post : "${post.caption}"`
                });
        }

        await post.save();

        const updatedPost = await Post.findById(id).populate("owner", "_id name username profilePic");

        res.status(200).json({post:{
            _id:updatedPost._id,
            caption:updatedPost.caption,
            image:updatedPost.image,
            owner:updatedPost.owner,
            likedBy:updatedPost.likedBy,
            comments:updatedPost.comments
        }});


    }catch(error){
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}


export const getLikes = async (req, res) => {
    try {
        const {id} = req.params;

        const post = await Post.findById(id).populate("likedBy", "_id name profilePic followers following");

        if(!post){
            return res.status(400).json({message:"Post not found"});
        }

        res.status(200).json(post.likedBy);
    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}

export const getFollowers = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id).populate("followers", "_id name profilePic followers following");

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        res.status(200).json(user.followers);
    } catch (error) {    
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}

export const getFollowing = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id).populate("following", "_id name profilePic followers following story bio email");

        if(!user){
            return res.status(400).json({message:"User not found"});
        }    

        res.status(200).json(user.following);    
    } catch (error) {
        res.status(500).json({message:error.message});
        console.log("error in posting" , error.message)
    }
}


export const bookmark = async (req, res) => {
    try {
      const { id } = req.params; // post ID
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const post = await Post.findById(id);
      if (!post) {
        return res.status(400).json({ message: "Post not found" });
      }
  
      const isSaved = user.saved.includes(post._id);
  
      if (isSaved) {
        // Remove bookmark
        user.saved = user.saved.filter(savedId => savedId.toString() !== post._id.toString());
      } else {
        // Add bookmark
        user.saved.push(post._id);
      }
  
      await user.save();
  
      res.status(200).json({ saved: user.saved, message: isSaved ? "Removed bookmark" : "Bookmarked" });
    } catch (error) {
      console.log("Error in bookmarking:", error.message);
      res.status(500).json({ message: error.message });
    }
  };

  
  export const getBookmarks = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const posts = await Post.find({ _id: { $in: user.saved } })
      .populate("owner", "_id name profilePic")
      .sort({ createdAt: -1 });
  
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log("error in posting", error.message);
    }
  };
