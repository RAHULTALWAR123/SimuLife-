import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { bookmark, createPost, getBookmarks, getFeed, getFollowers, getFollowing, getLikes, getPaidUserPosts, likeUnlike, userPosts } from "../controllers/post.controllers.js";

const router = express.Router();

router.get("/userPaidPost/:id",protectRoute,getPaidUserPosts);
router.get("/userpost/:id",protectRoute,userPosts);
router.get("/feed",protectRoute,getFeed);
router.get("/likes/:id",protectRoute,getLikes);
router.get("/followers/:id",protectRoute,getFollowers);
router.get("/following/:id",protectRoute,getFollowing);
router.get("/getbookmarks",protectRoute,getBookmarks);
router.post("/create",protectRoute,createPost);
router.post("/bookmark/:id",protectRoute,bookmark);
router.patch("/like-unlike/:id",protectRoute,likeUnlike);

export default router;