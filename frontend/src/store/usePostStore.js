import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
import socket from "../socket/socket";
import { useAuthStore } from "./useAuthStore";
// import { getFollowers } from "../../../backend/controllers/post.controllers";



export const usePostStore = create((set, get) => ({
    posts: [],
    feedPosts: [],
    userPosts: [],
    paidPosts : [],
    likes : [],
    followers:[],
    following : [],
    comments:[],
    bookmarks : [],
    commentsLoading: false,
    floading : false,
    postsLoading: false,
    likesLoading: false,
    bookLoading: false,

    createPost : async(data) => {
        set({ postsLoading: true })
        try{
            const res = await axios.post("/posts/create",data)
            set((state) => ({ posts: [...state.posts , res.data] , postsLoading: false }))
            console.log(res.data);
            toast.success("Post created successfully");
        }
        catch(error){
            set({ postsLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    getFeedPosts : async() => {
        set({ postsLoading: true })
        try{
            const res = await axios.get("/posts/feed")
            set({ feedPosts: res.data , postsLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ postsLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    getUserPosts : async(id) => {
        set({ postsLoading: true })
        try{
            const res = await axios.get(`/posts/userpost/${id}`)
            set({ userPosts: res.data , postsLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ postsLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    getUserPaidPost : async(id) => {
        set({ postsLoading: true })
        try{
            const res = await axios.get(`/posts/userPaidPost/${id}`)
            set({ paidPosts: res.data , postsLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ postsLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    likeUnlike : async(id) => {
        set({ likesLoading: true })
        const user = useAuthStore.getState().user
        try{
            const res = await axios.patch(`/posts/like-unlike/${id}`)
            set((state) => ({ feedPosts: state.feedPosts.map((post) => post._id === id ? res.data.post : post) , likesLoading: false }))

        
        if(res.data.post && res.data.post.likedBy.includes(user._id)){
            socket.emit("like_notifications",{
                recipientId: res.data.post.owner._id,
                senderId: user.name, // Using user.name as in your code
                postCaption: res.data.post.caption?.substring(0, 30) + '...'
            })
        }
            console.log(res.data);
            // toast.success("Post liked successfully");
        }
        catch(error){
            set({ likesLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    bookmarkpost: async (id) => {
        set({ bookLoading: true });
        try {
            const res = await axios.post(`/posts/bookmark/${id}`);
            const user = useAuthStore.getState().user;
            
            // Update the user's saved posts array
            const updatedUser = {
                ...user,
                saved: user.saved.includes(id) 
                    ? user.saved.filter(savedId => savedId.toString() !== id.toString())
                    : [...user.saved, id]
            };
            
            // Update the auth store with the new user data
            useAuthStore.setState({ user: updatedUser });
            
            set({ bookLoading: false });
            toast.success(res.data.message);
        } catch (error) {
            set({ bookLoading: false });
            toast.error(error.response?.data?.message || "Failed to bookmark post");
        }
    },

    getbookmarkpost : async() => {
        set({ postsLoading: true })
        try{
            const res = await axios.get("/posts/getbookmarks")
            set({ bookmarks: res.data , postsLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ postsLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    getlike : async(id) => {
        set({ likesLoading: true })
        try{
            const res = await axios.get(`/posts/likes/${id}`)
            set({ likes: res.data , likesLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ likesLoading: false })
            toast.error(error.response?.data?.message);
        }
        },

        getFollowers : async(id) => {
            set({ floading: true })
            try{
                const res = await axios.get(`/posts/followers/${id}`)
                set({ followers: res.data , floading: false })
                console.log(res.data);
            }
            catch(error){
                set({ floading: false })
                toast.error(error.response?.data?.message);
            }
            },

        getFollowings : async(id) => {
            set({ floading: true })
            try{
                const res = await axios.get(`/posts/following/${id}`)
                set({ following: res.data , floading: false })
                console.log(res.data);
            }
            catch(error){
                set({ floading: false })
                toast.error(error.response?.data?.message);
            }   
        },

        getComments : async(id) => {
            set({ floading: true })
            try{
                const res = await axios.get(`/comments/getComments/${id}`)
                set({ comments: res.data , floading: false })
                console.log(res.data);
            }
            catch(error){
                set({ floading: false })
                toast.error(error.response?.data?.message);
            }   
        },

    sendComment : async(id,text) => {
        set({ commentsLoading: true })
        try{
            const res = await axios.post(`/comments/comment/${id}`,{text})
            set((state) => ({ comments: [...state.comments , res.data.Comments] , commentsLoading: false }))

            socket.emit("comment_notifications",{
                recipientId:res.data.postComment.owner._id,
                senderId:res.data.Comments.name,
                text:res.data.Comments.text,
                postCaption:res.data.postComment.caption
            })

            console.log(res.data);
            toast.success("Comment sent successfully");
        }
        catch(error){
            set({ commentsLoading: false })
            toast.error(error.response?.data?.message);
        }
    }


}))