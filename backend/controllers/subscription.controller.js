import User from "../models/user.model.js";
import { stripe } from "../lib/stripe.js";
import Subscription from "../models/subscription.model.js";

export const createSubscriptionIntent = async (req, res) => {
    try {
        const { creatorId } = req.body;
        const subscriberId = req.user._id;

        if (creatorId === subscriberId.toString()) {
            return res.status(400).json({
                message: "You cannot subscribe to yourself"
            });
        }

        const creator = await User.findById(creatorId);
        if (!creator) {
            return res.status(404).json({
                message: "Creator not found"
            });
        }

        const user = await User.findById(subscriberId);

        const existingSubscription = user.subscriptionsActive.find(
            sub => sub.creator.toString() === creatorId &&
            new Date(sub.expiresAt) > new Date()
        );

        if (existingSubscription) {
            return res.status(400).json({
                message: "You already have an active subscription to this creator"
            });
        }

        if(creator.postPrice === 0) {
            return res.status(400).json({
                message: "Creator is not accepting payments"
            });
        }

        const subscriptionIntent = await stripe.paymentIntents.create({
            amount: creator.postPrice * 100,
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                creatorId: creator._id.toString(),
                subscriberId: subscriberId.toString(),
                postPrice: creator.postPrice
            }
        });

        res.json({
            clientSecret: subscriptionIntent.client_secret
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in subscription intent", error.message);
    }
}

export const verifySubscription = async (req, res) => {
    try {
        const { subscriptionIntentId, creatorId } = req.body;
        const subscriberId = req.user._id;

        // Check if subscription already exists with this payment intent
        const existingSubscription = await Subscription.findOne({
            stripePaymentIntentId: subscriptionIntentId
        });

        if (existingSubscription) {
            return res.status(400).json({
                message: "This payment has already been processed"
            });
        }

        const subscriptionIntent = await stripe.paymentIntents.retrieve(subscriptionIntentId);

        if (subscriptionIntent.status !== 'succeeded') {
            return res.status(400).json({
                message: "Payment not successful"
            });
        }

        const periodStart = new Date();
        const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Use a session to ensure all database operations are atomic
        const session = await Subscription.startSession();
        try {
            await session.withTransaction(async () => {
                // Create subscription document
                await Subscription.create([{
                    subscriber: subscriberId,
                    creator: creatorId,
                    amount: subscriptionIntent.amount / 100,
                    status: 'completed',
                    stripePaymentIntentId: subscriptionIntentId,
                    periodStart,
                    periodEnd
                }], { session });

                // Update subscriber's active subscriptions
                await User.findByIdAndUpdate(
                    subscriberId,
                    {
                        $push: {
                            subscriptionsActive: {
                                creator: creatorId,
                                subscribedAt: periodStart,
                                expiresAt: periodEnd
                            }
                        }
                    },
                    { session }
                );

                // Update creator's subscribers and income
                await User.findByIdAndUpdate(
                    creatorId,
                    {
                        $push: {
                            subscribers: {
                                user: subscriberId,
                                subscribedAt: periodStart,
                                expiresAt: periodEnd
                            }
                        },
                        $inc: { income: subscriptionIntent.amount / 100 }
                    },
                    { session }
                );
            });
        } finally {
            await session.endSession();
        }

        res.json({
            message: "Subscription activated successfully",
            expiresAt: periodEnd
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in subscription verification", error.message);
    }
}