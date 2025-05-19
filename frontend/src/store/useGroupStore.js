import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
import socket from "../socket/socket";

export const useGroupStore = create((set, get) => ({
    groups: [],
    groupLoading: false,
    groupConvo : null,
    groupMessages : [],
    groupMessageLoading : false,  
    MessageLoading : false,

    getGroup : async(id) => {
        set({ groupLoading: true })
        try {
            const res = await axios.get(`/groups/get-groups/${id}`);
            set({ groups: res.data , groupLoading: false });
            console.log(res.data);
        } catch (error) {
            set({ groupLoading: false });
            toast.error(error.response.data.message);
        }
    },

    leavegroup : async(id) => {
      set({ groupLoading: true })
      try {
        const res = await axios.post(`/groups/leavegroup/${id}`);
    
        set((state) => ({
          groups: state.groups.filter(group => group._id !== id),
          groupLoading: false
        }));
        
        toast.success("Group left successfully");
        return res.data;
      } catch (error) {
          set({ groupLoading: false });
          toast.error(error.response.data.message);
      }
    },

    createGroups : async(data) => {
        set({ groupLoading: true })
        try {
            const res = await axios.post("/groups/create-group",data);
            set((state) => ({ groups: [...state.groups , res.data] , groupLoading: false }));
            console.log(res.data);
            toast.success("Group created successfully");
        } catch (error) {
            set({ groupLoading: false });
            toast.error(error.response.data.message);
        }
    },

    joinAGroup : async(id) => {
        set({ groupLoading: true })
        try {
            const res = await axios.post(`/groups/joingroup`,{id});
            set((state) => ({ groups: [...state.groups , res.data] , groupLoading: false }));
            console.log(res.data);
            toast.success("Group joined successfully");
        } catch (error) {
            set({ groupLoading: false });
            toast.error(error.response.data.message);
        }
    },

    resetGroupMessages: () => {
        set({ groupMessages: [], groupConvo: null });
    },

    startGroupConvo: async(id) => {
        set({ groupConvo: null, groupLoading: true, groupMessages: [] }); // Clear messages immediately
        try {
          const res = await axios.post(`/groups/groupConvo/${id}`);

          if(res.data._id){
            socket.emit("join_group_chat",res.data._id);
          }

          set({ groupConvo: res.data, groupLoading: false });
          console.log(res.data);
        } catch (error) {
          set({ groupLoading: false });
          toast.error(error.response.data.message);
        }
      },

      getGroupMessage: async(id) => {
        set({ groupMessages: [], groupMessageLoading: true });
        try {
          const res = await axios.get(`/groups/getchat/${id}`);
          set({ groupMessages: res.data, groupMessageLoading: false });
        } catch (error) {
          set({ groupMessageLoading: false });
          toast.error(error.response.data.message);
        }
      },

    groupSendMessages : async(id,data) => {
        set({ MessageLoading: true })
        try {
            const res = await axios.post(`/groups/groupchat/${id}`,data);

            socket.emit("send_group_message",{
                groupId:get().groupConvo._id,
                message:res.data
            });

            set((state) => ({ groupMessages: [...state.groupMessages , res.data] ,MessageLoading: false }));
            console.log(res.data);
        } catch (error) {
            set({ MessageLoading: false });
            toast.error(error.response.data.message);
        }
    },

    addGroupMessage : (message) => {
        set((state) => ({ groupMessages: [...state.groupMessages , message] }));
    },

}))