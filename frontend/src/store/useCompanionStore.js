import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
// import { color } from "framer-motion";


export const useCompanionStore = create((set, get) => ({
    companions: [],
    owners: [],
    allCompanions: [],
    aiMessages: [],
    companionsLoading: false,
    convoCompanion : null,
    selectedCompanion : null,
    compId : null,
    compUser : null,
    aimessageLoading : false,
    sendMessageLoading : false,
    compLoading : false,
    companionsConvoLoading : false,
    plans: [],
    plansLoading: false,
    credits: 0,


    getCompanion : async() => {
        set({ companionsLoading: true })
        try {
            const res = await axios.get("/companion/bots")
            set({ companions: res.data.companions , companionsLoading: false })
        } catch (error) {
            set({ companionsLoading: false});
            toast.error(error.response.data.message);
        }
    },

    setSelectedCompanion : (companion) => {
        set({ selectedCompanion: companion })
    },

    setSelectCompId: (id) => {
        set((state) => ({
          companions: state.companions.map((companion) => 
            companion._id === id ? { ...companion } : companion
          ),
          compId : id,
        }));
      },

    getConvo : async(id) => {
        set({ companionsConvoLoading: true })
        try {
            const res = await axios.post(`/companion/start/${id}`)
            set({ convoCompanion: res.data.conversationId , companionsConvoLoading: false })
            console.log(res.data.conversationId);

        } catch (error) {
            set({ companionsConvoLoading: false})
            toast.error(error.response.data.message);
        }
    },

    getAiMessages : async(id) => {
        set({ aimessageLoading: true })
        try{
            const res = await axios.get(`/companion/messages/${id}`)
            set({ aiMessages: res.data.messages , aimessageLoading: false })
            console.log(res.data.messages);
        }catch(error){
            set({ aimessageLoading: false })
            toast.error(error.response.data.message);
        }
    },

    sendAiMessage : async(id,message) => {
        set({ sendMessageLoading: true })
        try{
            const res = await axios.post(`/companion/chat/${id}`,{message})
            set((state) => ({ aiMessages: [...state.aiMessages , res.data.userMessage , res.data.aiMessage] , credits: res.data.credits , sendMessageLoading: false }))
            console.log(res.data);

        }
        catch(error){
            set({ sendMessageLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    createCompanion : async(data) => {
        set({ compLoading: true })
        try{
            const res = await axios.post("/companion/new",data)
            set((state) => ({ companions: [...state.companions , res.data] , compLoading: false }))
            console.log(res.data);
            toast.success("Companion created successfully");
        }
        catch(error){
            set({ compLoading: false })
            toast.error(error.response?.data?.message);
        } 

    },

    getAll : async() => {
        set({ companionsLoading: true })
        try {
            const res = await axios.get("/companion/explore")
            set({ companions: res.data.companions , companionsLoading: false })
            console.log(res.data);
        } catch (error) {
            set({ companionsLoading: false});
            toast.error(error.response.data.message);
        }
    },

    buy : async(id) => {
        set({ compLoading: true })
        try{
            const res = await axios.patch(`/companion/buy/${id}`)
            set((state) => ({ companions: state.companions.map((companion) => companion._id === id ? res.data.companion : companion) , 
                owners: [...state.owners , res.data.companion.owner] ,
                compUser: res.data.user ,
                compLoading: false 
            }));
            // console.log(res.data);
            toast.success("Companion bought successfully");
        }
        catch(error){
            set({ compLoading: false })
            toast.error(error.response?.data?.message);
        }

    },

    getPlan : async() => {
        set({ plansLoading: true })
        try{
            const res = await axios.get("/plans/getplans");
            set({ plans: res.data , plansLoading: false });
            console.log(res.data);
        }
        catch(error){
            set({ plansLoading: false })
            toast.error(error.response?.data?.message);
        }
    }

}))