import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { deleteChat, getMessages, sendMessage, startConversation } from "../controllers/message.controller.js";

const router = express.Router();    

router.get("/get-chat/:id", protectRoute, getMessages);
router.post("/convo/:id", protectRoute, startConversation);
router.post("/chat/:id", protectRoute, sendMessage);
router.delete("/deleteChat/:id", protectRoute, deleteChat);


export default router