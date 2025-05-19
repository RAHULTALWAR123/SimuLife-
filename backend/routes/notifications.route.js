import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getNotifications } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/get-notifications/:id",protectRoute,getNotifications)


export default router