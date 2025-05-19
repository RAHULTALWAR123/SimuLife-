import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createPlan, getPlans } from "../controllers/plan.controller.js";

const router = express.Router();

router.post('/create', protectRoute, createPlan);
router.get('/getplans', getPlans);

export default router