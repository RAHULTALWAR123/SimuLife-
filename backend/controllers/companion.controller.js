import {Groq} from "groq-sdk";
import dotenv from "dotenv";
import Companion from "../models/companion.model.js";
import {v2 as cloudinary} from "cloudinary";
import User from "../models/user.model.js";
import AIConversation from "../models/aiConversation.model.js";
import AiMessage from "../models/aiMessage.model.js";

dotenv.config();


const groq = new Groq({
    apiKey: process.env.AI_API_KEY
});

const generateSystemPrompt = (companion) => 
    {
        return `You are ${companion.name}, fully embodying your identity and life experiences. 
    Your core identity: ${companion.identity}
    Background: ${companion.background}  
    Your personality traits:
    ${companion.traits.map(trait => `- ${trait}`).join('\n')}
    Important instructions:
    1. Always stay in character as ${companion.name}. You are ${companion.name}, not an AI or simulation.
    2. Base your responses entirely on your background, identity, and personality traits.
    3. Never make statements such as "I am assumed to be" or "I am playing the role of." Respond as if you are ${companion.name}.
    4. Use language, knowledge, and behavior consistent with your background, achievements, and personality.
    5. Avoid acknowledging that you are artificial or created in any way.
    6. If asked about something outside your character's scope of knowledge, respond naturally as ${companion.name} would in such a situation.
    7. Maintain conversational memory and respond contextually based on the current chat session.`;
    
    };
    

export const createCompanion = async (req, res) => {
    try{
        
        const {name,identity,background,traits,img} = req.body;
        let cloudinaryResponse = null;


        const user  = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        if(user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()){
            return res.status(400).json({message:"Your subscription has expired"});
        }

        if (img) {
            cloudinaryResponse = await cloudinary.uploader.upload(img, { folder: "insta-posts" });
        }

        if(!name || !identity || !background || !traits || !img){
            return res.status(400).json({message:"add all fields"});
        }


        const newCompanion = await Companion.create({
            name,
            identity,
            background,
            traits,
            img : cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            owner:[req.user._id]
        });

        user.Companions.push(newCompanion._id);

        await newCompanion.save();
        await user.save();

        res.status(201).json({
            message:"companion created successfully",
            companion : {
            _id:newCompanion._id,
            name:newCompanion.name,
            identity:newCompanion.identity,
            background:newCompanion.background,
            traits:newCompanion.traits,
            img:newCompanion.img,
            owner:newCompanion.owner
            }
            });
    }
    catch(error){
        res.status(500).json({error : error.message})
        console.log("error in companion" , error.message)
    }
}

export const getCompanions = async (req, res) => {
    try {
        const user  = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const companions = await Companion.find({ owner: { $in: [user._id] } });


        if(!companions){
            return res.status(400).json({message:"Companions not found"});
        }

        res.status(200).json({
            companions: companions.map(companion => ({
                _id: companion._id,
                name: companion.name,
                img: companion.img,
                identity: companion.identity,
            }))
        });


    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in companion" , error.message)
    }
}

export const getAllCompanions = async(req, res) => {
    try {
        const companions = await Companion.find({});

        if(!companions){
            return res.status(400).json({message:"Companions not found"});
        }

        res.status(200).json({
            companions: companions.map(companion => ({
                _id: companion._id,
                name: companion.name,
                img: companion.img,
                owner: companion.owner,
                identity: companion.identity,
            }))
        })

    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in companion" , error.message)
    }
}

export const buyCompanions = async (req, res) => {
    try{
        const {compId} = req.params;
        const user  = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const companion = await Companion.findById(compId);

        if(!companion){
            return res.status(400).json({message:"Companion not found"});
        }

        if(companion.owner.includes(user._id)){
            return res.status(400).json({message:"Companion already bought"});
        }
        user.freeLimit = 0;

        if(user.freeLimit === 0 && !user.isPro){
            return res.status(400).json({message:"You have reached your limit"});
        }

        if(user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()){
            return res.status(400).json({message:"Your subscription has expired"});
        }

        companion.owner.push(user._id);

        await companion.save();


        user.Companions.push(companion._id);

        await user.save();

        res.status(201).json({message:"companion bought successfully",
        companion : {
            _id:companion._id,
            name:companion.name,
            img:companion.img,
            owner:companion.owner
        },
        user : {
            isPro:user.isPro,
            freeLimit:user.freeLimit
        }
        });
    }
    catch(error){
        res.status(500).json({error : error.message})
        console.log("error in companion" , error.message)
    }
}

export const startConvo = async (req, res) => {
    try {
        const {id} = req.params;
        const user  = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const companion = await Companion.findById(id);

        if(!companion){
            return res.status(400).json({message:"Companion not found"});
        }
        


        const existingConvo = await AIConversation.findOne({userId:user._id,companionId:companion._id}).populate('companionId','img name');

        if(existingConvo){
            return res.status(200).json({conversationId : existingConvo._id ,companion : {
                _id:existingConvo.companionId._id,
                name:existingConvo.companionId.name,
                img:existingConvo.companionId.img
            }
        })
    }
        const newConvo = await AIConversation.create({
            userId:user._id,
            companionId:companion._id,
        });
        await newConvo.save();


        const populatedConvo = await AIConversation.findById(newConvo._id)
            .populate("companionId", "name img");


            res.status(201).json({
                message: "Conversation started",
                conversationId: populatedConvo._id,
                companion: {
                    name: populatedConvo.companionId.name,
                    img: populatedConvo.companionId.img
                }
            });

    } catch (error) {
        res.status(500).json({error : error.message})
        console.log("error in companion" , error.message)
    }
}

export const sendAiMessage = async (req, res) => {
    
    try{
        const {convoId} = req.params;
        const {message} = req.body;

        const conversation = await AIConversation.findById(convoId);

        if(!conversation){
            return res.status(400).json({message:"Conversation not found"});
        }

        if(conversation.userId.toString() !== req.user._id.toString()){
            return res.status(400).json({message:"Unauthorized"});
        }

        const companion = await Companion.findById(conversation.companionId);

        if(!companion){
            return res.status(400).json({message:"Companion not found"});
        }

const user = await User.findById(req.user._id).populate("planId", "name price interval");
if (!user) {
  return res.status(404).json({ message: "User not found" });
}

if(user.subscriptionEnd && new Date(user.subscriptionEnd) > new Date()){

if (!user.planId) {
  return res.status(400).json({ message: "No active subscription plan found" });
}

const totalCredits = user.planId.interval === "month" ? 500 : user.planId.interval === "week" ? 50 : 0;

if (totalCredits === 0) {
  return res.status(400).json({ message: "Invalid subscription plan" });
}

if (user.credits + 0.5 > totalCredits) {
  return res.status(400).json({ message: "Not enough credits left" });
}


user.credits += 0.5;
await user.save();
}

if(user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()){
    return res.status(400).json({message:"Subscription expired ,please buy a new plan"});
}

    

        const userMessage = await AiMessage.create({
            aiConversationId:conversation._id,
            sender:"user",
            content:message
        });

        await userMessage.save();

        const previousMessages = await AiMessage.find({ 
            aiConversationId: convoId
           }).sort({ createdAt: -1 }).limit(10);
           
           
           const conversationHistory = previousMessages
            .reverse()
            .map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.content
            }));


            const completion = await groq.chat.completions.create({
                messages : [

                    {role:"system",content: generateSystemPrompt(companion)},
                    ...conversationHistory,

                    {role:"user",content:message}

                ],
                model: 'llama-3.1-8b-instant',
                temperature: 1,
                max_tokens: 150
            })

            const aiResponse = completion.choices[0]?.message?.content;

            const aiMessage = await AiMessage.create({
                aiConversationId:conversation._id,
                sender:"ai",
                content:aiResponse
            });

            await aiMessage.save();

            res.status(200).json({
                userMessage,
                aiMessage,
                credits: user.isPro ? user.credits : 0
            });

    }
    catch(error){
        res.status(500).json({error : error.message})
        console.log("error in companion" , error.message)
    }
}


export const getAiChat = async (req, res) => {
    try {
        const {convoId} = req.params;

        const conversation = await AIConversation.findById(convoId);

        if(!conversation){
            return res.status(400).json({message:"Conversation not found"});
        }

        if(conversation.userId.toString() !== req.user._id.toString()){
            return res.status(400).json({message:"Unauthorized"});
        }

        const messages = await AiMessage.find({ 
            aiConversationId: convoId
        }).sort({ createdAt: 1 });

        res.status(200).json({  messages  });

    } catch (error) {
    res.status(500).json({error : error.message})
    console.log("error in companion" , error.message)
    }
}