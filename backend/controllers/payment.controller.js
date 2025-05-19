import { stripe } from "../lib/stripe.js";
import Plan from "../models/plan.model.js";
import User from "../models/user.model.js";

// export const createSubscription = async (req, res) => {
//   try {
//     const { planId, paymentMethodId } = req.body;
//     const userId = req.user._id;

//     const plan = await Plan.findById(planId);
//     if (!plan) {
//       return res.status(400).json({ message: "plan not found" });
//     }

//     const user = await User.findById(userId);

//     let customerId;

//     if (!user.stripeCustomerId) {
//       const customer = await stripe.customers.create({
//         payment_method: paymentMethodId,
//         email: user.email,
//         invoice_settings: {
//           default_payment_method: paymentMethodId,
//         },
//       });

//       customerId = customer.id;

//       await User.findByIdAndUpdate(userId, {
//         stripeCustomerId: customerId,
//       });
//     } else {
//       customerId = user.stripeCustomerId;
//     }

//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [{ price: plan.stripePriceId }],
//       payment_behavior: "default_incomplete",
//       payment_settings: {
//         payment_method_types: ["card"],
//         save_default_payment_method: "on_subscription",
//       },
//       expand: ["latest_invoice.payment_intent"],
//     });

//     const endDate = new Date();
//     if (plan.interval === "week") {
//       endDate.setDate(endDate.getDate() + 7);
//     } else if (plan.interval === "month") {
//       endDate.setMonth(endDate.getMonth() + 1);
//     }

//     await User.findByIdAndUpdate(userId, {
//       isPro: true,
//       subscriptionEnd: endDate,
//     });

//     res.json({
//       subscriptionId: subscription.id,
//       clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//     });
//   } catch (error) {
//     console.error("Subscription error:", error);
//     res.status(500).json({ message: "Error creating subscription" });
// }
// };

export const checkSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.subscriptionEnd) {
      return res.json({ isPro: false });
    }

    const now = new Date();
    const isSubscriptionValid = now < new Date(user.subscriptionEnd);

    // If subscription has expired, update user status
    if (!isSubscriptionValid && user.isPro) {
      await User.findByIdAndUpdate(req.user._id, {
        isPro: false,
      });
    }

    res.json({
      isPro: isSubscriptionValid,
      subscriptionEnd: user.subscriptionEnd,
    });
  } catch (error) {
    res.status(500).json({ message: "Error checking subscription status" });
  }
};


export const createPaymentIntent = async (req, res) => {
    try {
      const { planId } = req.body;
      const userId = req.user._id;
  
      // Check if user already has active subscription
      const user = await User.findById(userId);
      const now = new Date();
      if (user.subscriptionEnd && now < new Date(user.subscriptionEnd)) {
        return res.status(400).json({ 
          message: 'You already have an active subscription' 
        });
      }
      
      // Get plan details
      const plan = await Plan.findById(planId);
      if (!plan) {
        return res.status(400).json({ message: "Plan not found" });
      }
  
      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.price * 100, // convert to cents
        currency: 'inr',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          planId: plan._id.toString(),
          userId: userId.toString()
        }
      });
  
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent" });
    }
  };


  export const verifyPayment = async (req, res) => {
    try {
      const { paymentIntentId, redirectStatus } = req.body;
      const userId = req.user?._id;
  
      console.log('Starting payment verification for:', { paymentIntentId, userId });
  
      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID is required'
        });
      }
  
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
  
      // First, get the user to check their current subscription status
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      console.log('Retrieved payment intent:', paymentIntent.id, 'Status:', paymentIntent.status);
  
      if (!paymentIntent) {
        return res.status(404).json({
          success: false,
          message: 'Payment intent not found'
        });
      }
  
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment not successful'
        });
      }
  
      // Get the plan details
      const plan = await Plan.findById(paymentIntent.metadata.planId);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Subscription plan not found'
        });
      }
  
      // Calculate subscription end date
      const endDate = new Date();
      if (plan.interval === "week") {
        endDate.setDate(endDate.getDate() + 7);
      } else if (plan.interval === "month") {
        endDate.setMonth(endDate.getMonth() + 1);
      }
  
      // If user has an active subscription, handle it appropriately
      const now = new Date();
      if (user.subscriptionEnd && now < new Date(user.subscriptionEnd)) {
        // Log the dates for debugging
        console.log('Current subscription end:', user.subscriptionEnd);
        console.log('Current date:', now);
        
        // Extend the subscription instead of throwing an error
        const newEndDate = new Date(user.subscriptionEnd);
        if (plan.interval === "week") {
          newEndDate.setDate(newEndDate.getDate() + 7);
        } else if (plan.interval === "month") {
          newEndDate.setMonth(newEndDate.getMonth() + 1);
        }
  
        await User.findByIdAndUpdate(userId, {
          subscriptionEnd: newEndDate,
          stripeCustomerId: paymentIntent.customer || user.stripeCustomerId,
          planId: plan._id
        });
  
        return res.json({
          success: true,
          message: 'Subscription extended successfully'
        });
      }
  
      // Update user status for new subscription
      await User.findByIdAndUpdate(userId, {
        isPro: true,
        subscriptionEnd: endDate,
        stripeCustomerId: paymentIntent.customer,
        planId: plan._id,
        credits: 0
      });
  
      console.log('Subscription activated successfully for user:', userId);
  
      return res.json({
        success: true,
        message: 'Subscription activated successfully'
      });
  
    } catch (error) {
      console.error('Payment verification error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error verifying payment'
      });
    }
  };