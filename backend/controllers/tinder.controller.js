import e from "express";
import User from "../models/user.model.js";

export const userInfo = async(req, res) => {
    try{

        const {gender,height,age,about,lookingFor,sexuality,hopingToFind,qualities} = req.body;
        
        const user = await User.findById(req.user._id);
        
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        
        if(!gender || !height || !age || !about || !lookingFor || !sexuality || !hopingToFind || !qualities){
            return res.status(400).json({message:"All fields are required"});
        }

        if(height < 140 || age < 18){
        return res.status(400).json({message:"Not eligible"});
    }

    if(gender === 'male'){
        if(sexuality === 'Lesbian'){
            return res.status(400).json({message:"Not eligible"});
        }
    }
    else if(gender === 'female'){
        if(sexuality === 'Gay'){
            return res.status(400).json({message:"Not eligible"});
        }
    }

    user.gender = gender;
    user.height = height;
    user.age = age;
    user.about = about;
    user.lookingFor = lookingFor;
    user.sexuality = sexuality;
    user.hopingToFind = hopingToFind;
    user.qualities = qualities;
    
    await user.save();
    
    res.status(200).json(user);
}

catch(error){
    res.status(500).json({error : error.message});
    console.log("error in login" , error.message)
}
}

export const perfectMatch = async(req, res) => {
  try {
      const {sexuality, lookingFor, hopingToFind, qualities} = req.body;
      const user = await User.findById(req.user._id);

      if(!user) {
          return res.status(400).json({message: "User not found"});
      }
      
      if(!sexuality || !lookingFor || !hopingToFind || !qualities) {
          return res.status(400).json({message: "All fields are required"});
      }
      if(user.height === 0){
          return res.status(400).json({message:"First fill your profile then you will be eligible to find a perfect match"});
      }

      // Initialize gender variable based on user's gender
      let gender = user.gender;
      let query = {
          _id: { $ne: user._id },
          lookingFor,
          hopingToFind: { $in: hopingToFind },
          qualities: { $in: qualities }
      };

      if(sexuality === 'Pansexual') {
          gender = { $in: ['male', 'female', 'other'] };
      } 
      else if(sexuality === 'Gay') {
          query.sexuality = { $in: ['Gay', 'Bisexual'] };
          gender = 'male';
      }
      else if(sexuality === 'Lesbian') {
          query.sexuality = { $in: ['Lesbian', 'Bisexual'] };
          gender = 'female';
      }
      else if(sexuality === 'Bisexual') {
          query.sexuality = { $in: ['Bisexual', 'Pansexual', 'Gay', 'Lesbian'] };
          gender = { $in: ['male', 'female'] };
      }
      else if(sexuality === 'Trans') {
          query.sexuality = { $in: ['Trans', 'Gay', 'Bisexual'] };
          gender = { $in: ['male', 'female', 'other'] };
      }
      else {
          // Default case (typically for 'Straight')
          query.sexuality = sexuality;
          gender = user.gender === 'male' ? 'female' : 'male';
      }

      // Add gender to the query
      query.gender = gender;

      const filteredUsers = await User.find(query);

      if(filteredUsers.length === 0) {
          return res.status(400).json({message: "No Matches found"});
      } 
      
      res.status(200).json(filteredUsers);

  } catch (error) {
      res.status(500).json({error: error.message});
      console.log("Error in perfectMatch:", error.message);
  }
}