import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
import socket from "../socket/socket";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
    convoLoading: false,
    convoUser: null,
    selectedUser: null,
    messageLoading: false,
    sendMessageLoading: false,
    messages: [],

    getConversation : async(id) => {
        set({ convoLoading: true })
        try{
            const res = await axios.post(`/messages/convo/${id}`)
            set({  convoUser: res.data ,convoLoading: false })

            if(res.data.conversationId){
                socket.emit("join_chat",res.data.conversationId);
            }

            console.log(res.data);
        }
        catch(error){
            set({ convoLoading: false })
            toast.error(error.response.data.message)
        }
    },

    setSelectedUser : (user) => {
        set({ selectedUser: user })
    },

    getMessage : async(id) => {
        set({ messageLoading: true })
        try{
            const res = await axios.get(`/messages/get-chat/${id}`)
            set({ messages: res.data , messageLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ messageLoading: false })
            toast.error(error.response.data.message)
        }   
    },

    sendMessages : async(data,id) => {
        set({ sendMessageLoading: true })
        const user = useAuthStore.getState().user
        try {
            const res = await axios.post(`/messages/chat/${id}`,data)
            const newMessage = res.data.newMessage;

            socket.emit("send_message",{
                conversationId:get().convoUser.conversationId,
                message:newMessage
            })

            socket.emit("message_notifications",{
                recipientId:id,
                senderId:user.name
            })

            set((state) => ({ messages: [...state.messages , newMessage] , sendMessageLoading: false }))
            console.log(res.data.newMessage);
        } catch (error) {
            set({ sendMessageLoading: false })
            toast.error(error.response.data.message)
        }
    },

    addMessage : (message) => {
        set((state) => ({ messages: [...state.messages , message] }))
    },

    delChat: async(id) => {
        set({ convoLoading: true });
        try {
          const res = await axios.delete(`/messages/deleteChat/${id}`);
          
          // Clear messages immediately after successful deletion
          set({ 
            messages: [], 
            convoLoading: false 
          });
          
          // Update conversations list by removing the deleted conversation
        //   set(state => ({
        //     conversations: state.conversations.filter(convo => 
        //     )
        //   }));
          
          // Clear selected user if it's the one we just deleted the chat with
          if (get().selectedUser?._id === id) {
            set({ selectedUser: null });
          }
          
          console.log("Chat deleted successfully:", res.data);
          toast.success("Chat deleted successfully");
        }
        catch(error) {
          set({ convoLoading: false });
          toast.error(error.response?.data?.message || "Failed to delete chat");
          console.error("Error deleting chat:", error);
        }
      },

}))