import express from "express";
import { editProfile, enterPostsPrice, followUnfollow, getFriends, getProfile, getSuggestedUsers, getUserPlan, getUserProfile, login, logout, SearchUser, signup } from "../controllers/auth.controllers.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();


router.get("/friends/:id",protectRoute,getFriends);
router.get("/suggested",protectRoute,getSuggestedUsers);
router.get("/user/:id",protectRoute,getUserProfile);
router.get("/search/:query",protectRoute,SearchUser);
router.get("/getuserplans",protectRoute,getUserPlan);
router.get("/profile",protectRoute,getProfile);
router.post("/signup", signup);
router.post("/login",login);
router.post("/logout",logout);
router.patch("/follow-unfollow/:id",protectRoute,followUnfollow);
router.patch("/edit",protectRoute,editProfile);
router.patch("/post-price/:id",protectRoute,enterPostsPrice);

export default router;