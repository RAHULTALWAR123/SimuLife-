import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createGroup, getGroups, groupConvo, groupGetMessage, groupSendMessage, joinGroup, leaveGroup } from "../controllers/group.controller.js";

const router = express.Router();    

router.get("/get-groups/:id",protectRoute,getGroups);
router.get("/getchat/:id", protectRoute, groupGetMessage);
router.post("/create-group",protectRoute, createGroup);
router.post("/groupConvo/:id",protectRoute,groupConvo);
router.post("/groupchat/:id",protectRoute,groupSendMessage);
router.post("/joingroup",protectRoute,joinGroup);
router.post("/leavegroup/:id",protectRoute,leaveGroup);


export default router