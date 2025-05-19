import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    stripePaymentIntentId: {
        type: String,
        unique: true,
        required: true
    },
    periodStart: {
        type: Date,
        required: true
    },
    periodEnd: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
}
);

subscriptionSchema.index({ subscriber: 1, creator: 1 ,periodEnd: 1} );

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription
