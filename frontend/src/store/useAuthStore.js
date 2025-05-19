import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
import socket from "../socket/socket";

let socketInitialized = false;
export const useAuthStore = create((set, get) => ({
    user: null,
    otherUser: null,
    suggested: [],
    // userFollows: [],
    userLoading: false,
    followLoading: false,
    checkingauth: true,
    usersLoading: false,
    friendLoading: false,
    friends:[],
    searchedUsers:[],
    plan:null,
    onlineUsers: new Set(),


    signup: async({name,username,email,password,confirmPassword}) => {
        set({userLoading: true});

        if(password !== confirmPassword){
            set({userLoading: false});
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post("/auth/signup", {name,username,email,password});
            set({user: res.data , userLoading: false});
            console.log(res.data);
            toast.success("Account created successfully");

        } catch (error) {
            set({userLoading: false});
            toast.error(error.response.data.message);
        }
    },
    login: async(email, password) => {
        set({userLoading: true});
        try {
            const res = await axios.post("/auth/login", {email, password});
            set({user: res.data, userLoading: false});
            
            // Emit online status after successful login
            socket.connect(); // Ensure socket is connected
            socket.emit("user_online", res.data._id);
            
            toast.success("Logged in successfully");
        } catch (error) {
            set({userLoading: false});
            toast.error(error.response?.data?.message);
        }
    },
    
    // Logout function
    logout: async() => {
        set({ userLoading: true });
        try {
            await axios.post("/auth/logout");
            
            // Clear online users before disconnecting
            set({ onlineUsers: new Set() });
            socket.disconnect();
            
            set({ user: null, userLoading: false });
            toast.success("Logged out successfully");
        } catch (error) {
            set({ userLoading: false });
            toast.error(error.response?.data?.message);
        }
    },
    
    // Profile function
    getprofile: async() => {
        set({ checkingauth: true });
        try {
          const res = await axios.get("/auth/profile");
          set({ user: res.data, checkingauth: false });
          
          // Initialize socket connection after successful user fetch
          if (res.data?._id) {
            initializeSocket(res.data._id, get().setOnlineUsers, get().updateUserStatus);
          }
        } catch (error) {
          set({ checkingauth: false });
          toast.error(error.response?.data?.message);
        }
      },


      setOnlineUsers: (users) => {
        // Make sure we're getting an array and converting to Set properly
        if (Array.isArray(users)) {
          set({ onlineUsers: new Set(users) });
          console.log('Updated online users list:', users);
        } else {
          console.error('Expected array for onlineUsers, got:', users);
        }
      },

      updateUserStatus: (userId, status) => {
        set(state => {
          // Create a new Set from the existing one (for immutability)
          const newOnlineUsers = new Set(state.onlineUsers);
          
          if (status === "online") {
            newOnlineUsers.add(userId);
          } else {
            newOnlineUsers.delete(userId);
          }
          
          console.log(`User ${userId} is now ${status}. Online users:`,
            Array.from(newOnlineUsers));
          
          return { onlineUsers: newOnlineUsers };
        });
      },

      isUserOnline: (userId) => {
        const hasUser = get().onlineUsers.has(userId);
        return hasUser;
      },

      reconnectSocket: () => {
        const userId = get().user?._id;
        if (userId) {
          initializeSocket(userId, get().setOnlineUsers, get().updateUserStatus);
        }
      },

    // getprofile : async() => {
    //     set({ checkingauth: true })
    //     try {
    //         const res = await axios.get("/auth/profile")
    //         set({ user: res.data, checkingauth: false })

    //         if (res.data?._id) {
    //             socket.emit("user_online", res.data._id);
    //         }
            
    //         const onlineUsersRes = await axios.get("/online-users");
    //         set({ onlineUsers: new Set(onlineUsersRes.data) });

    //         console.log(res.data);
    //     } catch (error) {
    //         set({ checkingauth: false })
    //         return toast.error(error.response.data.message || "an error occured")
    //     }
    // },

    editP : async(data) => {
        set({ userLoading: true })
        try {
            const res = await axios.patch("/auth/edit",data)
            set({ user: res.data, userLoading: false })
            console.log(res.data);
            toast.success("Profile updated successfully");
        } catch (error) {
            set({ userLoading: false })
            return toast.error(error.response.data.message || "an error occured")
        }
    },

    searchUsers :async(query) => {
        set({ usersLoading: true })
        try {
            if (!query || query.length < 2) {
                set({ 
                    searchedUsers: [],
                    usersLoading: false 
                });
                return;
            }
            const res = await axios.get(`/auth/search/${query}`)
            set({ searchedUsers: res.data , usersLoading: false })
            console.log(res.data);
        } catch (error) {
            set({ usersLoading: false })
            return toast.error(error.response.data.message || "an error occured")
        }
    },

    userProfile : async(id) => {
        set({ userLoading: true })
        try {
            const res = await axios.get(`/auth/user/${id}`)
            set({ otherUser: res.data , userLoading: false })
            console.log(res.data);
        } catch (error) {
            set({ userLoading: false })
            return toast.error(error.response.data.message || "an error occured")
        }
    },


    followUser : async(id) => {
        set({ followLoading: true })
        try{
            const res = await axios.patch(`/auth/follow-unfollow/${id}`);
            set({ user: res.data.currentUser  , otherUser: res.data.user , followLoading: false })

            socket.emit("follow_notifications",{
                recipientId: res.data.user._id,
                senderId: res.data.currentUser.name
            })
            console.log(res.data);

        }
        catch(error){
            set({ followLoading: false })
            return toast.error(error.response.data.message || "an error occured")
        }
    },


    getSuggested : async() => {
        set({ usersLoading: true })
        try {
            const res = await axios.get("/auth/suggested")
            set({ suggested: res.data , usersLoading: false })
            console.log(res.data);
        } catch (error) {
            set({ usersLoading: false })
            return toast.error(error.response.data.message || "an error occured")
        }
    },

    getfriends : async(id) => {
        set({ friendLoading: true })
        try {
            const res = await axios.get(`/auth/friends/${id}`)
            set({ friends: res.data , friendLoading: false })
            console.log(res.data);
        } catch (error) {
            set({ friendLoading: false })
            return toast.error(error.response.data.message || "an error occured")
        }
    },
    

    getUserPlans : async() => {
        set({ userLoading: true })
        try {
            const res = await axios.get("/auth/getuserplans")
            set({ plan: res.data , userLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ userLoading: false })
            return toast.error(error.response.data.message || "an error occured")
        }
    },

    enterPostPrice : async(postPrice,id) => {
        set({ userLoading: true })
        try {
            const res = await axios.patch(`/auth/post-price/${id}`,{postPrice})
            set({ user: res.data , userLoading: false })
            console.log(res.data);
            toast.success("Post price updated successfully");
        }
        catch(error){
            set({ userLoading: false })
            return toast.error(error.response.data.message || "an error occured")
        }
    },

}));


function initializeSocket(userId, setOnlineUsers, updateUserStatus) {
    if (!userId) return;
    
    console.log("Initializing socket connection for user:", userId);
    
    // Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
      console.log("Socket connecting...");
    }
    
    // Emit user online event to register with server
    socket.emit("user_online", userId);
    console.log("Emitted user_online event for:", userId);
    
    // Request current online users list from server
    socket.emit("get_online_users");
    
    // Set up event listeners (only if not already set up)
    if (!socketInitialized) {
      // Listen for online users list
      socket.on("online_users_list", (users) => {
        console.log("Received initial online users list:", users);
        setOnlineUsers(users);
      });
      
      // Listen for user status changes
      socket.on("user_status_change", ({ userId, status, onlineUsers: updatedOnlineUsers }) => {
        console.log("Received user_status_change:", { userId, status, updatedOnlineUsers });
        
        if (updatedOnlineUsers) {
          setOnlineUsers(updatedOnlineUsers);
        } else {
          updateUserStatus(userId, status);
        }
      });
      
      // Set up reconnection handler
      socket.io.on("reconnect", () => {
        console.log("Socket reconnected, re-emitting user_online");
        socket.emit("user_online", userId);
        socket.emit("get_online_users");
      });
      
      socketInitialized = true;
    }
  }
  