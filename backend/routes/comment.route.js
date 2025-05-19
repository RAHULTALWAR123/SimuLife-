import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getComment, sendComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/getComments/:id",protectRoute,getComment);
router.post("/comment/:id",protectRoute,sendComment);

export default router;