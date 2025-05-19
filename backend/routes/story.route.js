import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createStory, getStory } from "../controllers/story.controller.js";

const router = express.Router();

router.get("/get-story/:id",protectRoute,getStory);
router.post("/create-story",protectRoute,createStory);


export  default router; 