import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { checkSubscriptionStatus, createPaymentIntent, verifyPayment } from "../controllers/payment.controller.js";
// import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// router.post("/create-subscription",protectRoute,createSubscription);
router.post("/create-payment-intent",protectRoute,createPaymentIntent);
router.post("/verify-payment",protectRoute,verifyPayment);
router.get("/subscription-status",protectRoute,checkSubscriptionStatus);



export default router;