import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";


export const useTinderStore = create((set, get) => ({
    matches : [],
    userdata : null,
    matchLoading : false,

    shareU : async(formData) => {
        set({ matchLoading: true })
        try{
            const res = await axios.post("/tinder/aboutme",formData)
            set({ userdata: res.data , matchLoading: false })
            console.log(res.data);
            toast.success("User data shared successfully");
        }
        catch(error){
            set({ matchLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    findMatch : async(formData) => {
        set({ matchLoading: true })
        try{
            const res = await axios.post("/tinder/findmatch",formData)
            set({ matches: res.data , matchLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ matchLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

}))