import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/cookie.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notifications.model.js";

export const signup = async (req, res) => {
    try {
        const {name,username,email,password} = req.body

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({
            $or: [{ email: email }, { username: username }],
        });

        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({name,username,email,password:hashedPassword});

        await user.save();

        if(user){
            generateTokenAndSetCookie(user._id,res)
            res.status(201).json({
                _id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
            })
        }
        else{
            res.status(400).json({message:"invalid user data"});
        }


    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message});
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch || !user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(user._id,res)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
        });


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:1});
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error.message);    
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try{
        res.json(req.user);
    }catch(error){
        res.status(500).json({error : error.message})
        console.log("error in login" , error.message)
    }
}

export const followUnfollow = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        const currentUser = await User.findById(req.user._id);

        
        if(id === req.user._id.toString()) return res.status(400).json({message: "you cant follow or unfollow yourself"})

        if(!user || !currentUser){
            return res.status(400).json({message:"User not found"});
        }

        if(user.followers.includes(req.user._id)){
            await User.findByIdAndUpdate(req.user._id , {$pull: {following : id}})
            await User.findByIdAndUpdate(id , {$pull: {followers : req.user._id}})

            await Notification.findOneAndDelete({
                recipient : user._id,
                type : "follow",
                sender : req.user._id,

            })
        }
        else{
            user.followers.push(req.user._id);
            currentUser.following.push(user._id);

            await Notification.create({
                recipient: user._id,
                sender : req.user._id,
                type : "follow",
                message : `${req.user.name} started following you`
            })
        }

        await user.save();
        await currentUser.save();


        const updatedUser = await User.findById(id);
        const updatedCurrentUser = await User.findById(req.user._id);
    

        res.status(200).json({
          message: user.followers.includes(req.user._id) ? "Unfollowed successfully" : "Followed successfully",
          user: {
            _id: updatedUser._id,
            followers: updatedUser.followers,
            following: updatedUser.following,
            profilePic: updatedUser.profilePic,
            username: updatedUser.username,
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio,
          },
          currentUser: {
            _id: updatedCurrentUser._id,
            following: updatedCurrentUser.following,
            profilePic: updatedCurrentUser.profilePic,
            username: updatedCurrentUser.username,
            name: updatedCurrentUser.name,
            email: updatedCurrentUser.email,
            bio: updatedCurrentUser.bio,
            followers: updatedCurrentUser.followers,
          },
        });


    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in login" , error.message)
    }
}


export const editProfile = async (req, res) => {
    try {
        const {name,username,email,bio,password} = req.body;
        // let cloudinaryResponse = null;
        let {profilePic} = req.body

        const user  = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        if(password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            user.password = hashedPassword
        }

        if(profilePic){
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            } 
            const uploadedResponse = await cloudinary.uploader.upload(profilePic)
            profilePic = uploadedResponse.secure_url
        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.password = password || user.password;
        user.profilePic = profilePic || user.profilePic;

        await user.save();

        res.status(200).json({ 
            _id:user._id,
            name:user.name,
            username:user.username,
            email:user.email,
            bio:user.bio,
            profilePic:user.profilePic
        })


    }
    catch(error){
        res.status(500).json({error : error.message})
        console.log("error in login" , error.message)
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).populate("following followers","name username profilePic");

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in login" , error.message)
    }
}


export const SearchUser = async (req, res) => {
    try {
        const { query } = req.params;
        

        if (query.length < 2) {
            return res.status(200).json([]);
        }

        const users = await User.find({
            $or: [
                { name: { $regex: `^${query}`, $options: "i" } }, 
                { username: { $regex: `^${query}`, $options: "i" } }
            ]
        })
        .select('_id name username profilePic')
        .limit(10); 

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in user search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const suggestedUsers = await User.find({
            $and : [
                {
                    _id : {$ne : user._id}
                },
                {
                    _id : {$nin : user.following}
                },
            ]
        }).populate("following followers","_id name profilePic").limit(4);

        res.status(200).json(suggestedUsers);


    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in login" , error.message)
    }
}

export const getFriends = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const friends = await User.find(
            { _id: { $in: [...user.followers, ...user.following] } },
            "_id name profilePic bio email followers following"
        );


        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in login" , error.message)
    }
}


export const getUserPlan = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).populate("planId","name price interval");

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        res.status(200).json(user.planId);


    }
    catch(error){
        res.status(500).json({error : error.message})
        console.log("error in login" , error.message)
    }
}

export const enterPostsPrice = async (req, res) => {
    try {
        const {id} = req.params;
        const {postPrice} = req.body;

        const user = await User.findById(id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        if(!postPrice){
            return res.status(400).json({message:"Post price is required"});
        }

        user.postPrice = postPrice;

        await user.save();

        res.status(200).json(user);


    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in login" , error.message)
    }
}