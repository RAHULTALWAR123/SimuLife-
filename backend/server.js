import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import companionRoutes from "./routes/companion.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js"
import commentRoutes from "./routes/comment.route.js";
import storyRoutes from "./routes/story.route.js";
import paymentRoutes from "./routes/payment.route.js"
import subscriptionRoutes from "./routes/subscription.route.js"
import planRoutes from "./routes/plan.route.js"
import notificationRoutes from "./routes/notifications.route.js"
import tinderRoutes from "./routes/tinder.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import path from "path";


dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const onlineUsers = new Map();


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    
    socket.on("get_online_users", () => {
        console.log("Client requested online users list");
        socket.emit("online_users_list", Array.from(onlineUsers.keys()));
      });
      
      socket.on("user_online", (userId) => {
        if (!userId) {
          console.error("Received user_online event without userId");
          return;
        }
    
        const existingSocketId = onlineUsers.get(userId);
        if (existingSocketId && existingSocketId !== socket.id) {
          console.log(`User ${userId} is already online with another socket. Updating socket ID.`);
        }
        
        onlineUsers.set(userId, socket.id);
        
        socket.userId = userId;
        
        io.emit("user_status_change", {
          userId: userId,
          status: "online",
          onlineUsers: Array.from(onlineUsers.keys())
        });
        
        console.log(`User ${userId} is now online. Total online users:`, 
          Array.from(onlineUsers.keys()));
      });

    socket.on("join_chat", (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined chat: ${conversationId}`);
    });

    socket.on("join_group_chat", (groupId) => {
        socket.join(groupId);
        console.log(`User ${socket.id} joined group chat: ${groupId}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.conversationId).emit("receive_message", data.message);
    });

    socket.on("send_group_message", (data) => {
        socket.to(data.groupId).emit("receive_group_message", data.message);
    });

    socket.on("like_notifications", (data) => {
        const {recipientId, senderId, postCaption} = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("like_notification", {
                type: "like",
                message: `${senderId} liked your post: ${postCaption}`
            });
        }
    });

    socket.on("follow_notifications", (data) => {
        const {recipientId, senderId} = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("follow_notification", {
                type: "follow",
                message: `${senderId} started following you`
            });
        }
    })

    socket.on("comment_notifications", (data) => {
        const {recipientId,senderId,postCaption,text} = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("comment_notification", {
                type: "comment",
                message: `${senderId} commented : "${text}" on your post : "${postCaption}"`
            })
        }
    })

    socket.on("message_notifications",(data) => {
        const {recipientId,senderId} = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("message_notification",{
                type:"chat",
                message:`${senderId} sent you a message`
            })
        }
    })

    // Disconnect Handler
    socket.on("disconnect", () => {

        console.log(`Socket disconnected: ${socket.id}`);
        const disconnectedUserId = socket.userId;
    
    if (disconnectedUserId) {
      const currentSocketId = onlineUsers.get(disconnectedUserId);
      if (currentSocketId === socket.id) {
        onlineUsers.delete(disconnectedUserId);
        
        io.emit("user_status_change", {
          userId: disconnectedUserId,
          status: "offline",
          onlineUsers: Array.from(onlineUsers.keys())
        });
        
        console.log(`User ${disconnectedUserId} is now offline. Remaining users:`, 
          Array.from(onlineUsers.keys()));
      } else {
        console.log(`User ${disconnectedUserId} disconnected but still has another active socket.`);
      }
    }
    });
});
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/companion",companionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups",groupRoutes)
app.use("/api/comments", commentRoutes);
app.use("/api/story",storyRoutes);
app.use("/api/payments",paymentRoutes)
app.use("/api/subscription",subscriptionRoutes)
app.use("/api/plans",planRoutes)
app.use("/api/notifications",notificationRoutes)
app.use("/api/tinder",tinderRoutes)

app.get("/api/online-users", (req, res) => {
    res.json(Array.from(onlineUsers.keys()));
});

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
