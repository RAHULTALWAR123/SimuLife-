import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createSubscriptionIntent, verifySubscription } from "../controllers/subscription.controller.js";

const router = express.Router();

router.post('/create-subscription-intent', protectRoute, createSubscriptionIntent);
router.post('/verify-subscription', protectRoute, verifySubscription);

export default router;