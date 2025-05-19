import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
        },
        username:{
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        bio:{
            type: String,
        },
        profilePic: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        freeLimit: {
            type: Number,
            default: 1,
        },
        isPro:{
            type: Boolean,
            default: false,
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
        likes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            }
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            }
        ],
        paidPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            }
        ],
        subscribers: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            subscribedAt: {
                type: Date,
                default: Date.now
            },
            expiresAt: {
                type: Date,
                required: true
            }
        }],
        subscriptionsActive: [{
            creator: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            subscribedAt: {
                type: Date,
                default: Date.now
            },
            expiresAt: {
                type: Date,
                required: true
            }
        }],
        paidUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ], 
        story: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Story",
                expires: 86400
            }
        ],
        saved:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        friendRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        Companions:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Companion",
            }
        ],
        stripeCustomerId: {
            type: String,
            // required: true
        },
        stripeConnectAccountId: {
            type: String,
        },
        subscriptionEnd: {
            type: Date,
            default: null
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
        },
        credits: {
            type: Number,
            default: 0,
        },
        income: {
            type: Number,
            default: 0,
        },
        postPrice: {
            type: Number,
            default: 0
        },
        gender: {
            type: String,
            enum: ['male', 'female','other'],
            default: 'male'
        },
        height: {
            type: Number,
            default: 0
        },
        age: {
            type: Number,
            default: 0
        },
        about:{
            type: String
        },
        sexuality:{
            type: String,
            enum:['Straight','Gay','Bisexual','Lesbian','Pansexual','Trans'],
            default: 'Straight'
        },
        lookingFor: {
            type: String,
            enum: ['Dating', 'BFF','Bizz'],
            default: 'BFF'
        },
        partner:{
            type: String,
            enum: ['male', 'female','All'],
            default: 'female'
        },
        hopingToFind: {
            type: [String],
            enum: ['long-term Relationship', 'A life partner', 'Fun,casual relationship', 'Marriage', 'Intimacy without commitment'],
            default: ['long-term Relationship']
        },
        qualities:{
            type: [String],
            enum: ['Intelligence', 'Charisma', 'Sociability', 'Honesty', 'Kindness', 'Loyalty', 'Humor'],            
            default: ['Intelligence']
        }
        
        
    },
    {timestamps: true}
)



const User = mongoose.model("User", userSchema);

export default User