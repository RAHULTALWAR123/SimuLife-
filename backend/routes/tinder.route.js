import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { perfectMatch, userInfo } from "../controllers/tinder.controller.js";

const router = express.Router();

router.post("/aboutme",protectRoute,userInfo);
router.post("/findmatch",protectRoute,perfectMatch);

export default router;