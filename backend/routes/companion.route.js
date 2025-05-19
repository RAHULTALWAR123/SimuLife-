import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { buyCompanions, createCompanion, getAiChat, getAllCompanions, getCompanions, sendAiMessage, startConvo } from "../controllers/companion.controller.js";

const router = express.Router();

router.get("/messages/:convoId",protectRoute,getAiChat);
router.get("/bots",protectRoute,getCompanions);
router.get("/explore",protectRoute,getAllCompanions);
router.post("/new",protectRoute,createCompanion);
router.post("/start/:id",protectRoute,startConvo);
router.post("/chat/:convoId",protectRoute,sendAiMessage);
router.patch("/buy/:compId",protectRoute,buyCompanions)


export default router