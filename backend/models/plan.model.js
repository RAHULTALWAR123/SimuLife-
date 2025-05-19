import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    interval: {
        type: String,
        enum: ['week', 'month'],
        required: true
    },
    stripePriceId: {
        type: String,
        required: true
    },
    features: [{
        type: String
    }]
},{ timestamps: true })

const Plan = mongoose.model("Plan", planSchema);

export default Plan