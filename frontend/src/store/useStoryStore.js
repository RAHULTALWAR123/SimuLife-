import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";


export const useStoryStore = create((set, get) => ({
    user : null,
    stories: [],
    storiesLoading: false,

    getStories : async(id) => {
        set({ storiesLoading: true })
        try{
            const res = await axios.get(`/story/get-story/${id}`)
            set({ stories: res.data , storiesLoading: false })
            console.log(res.data);
        }
        catch(error){
            set({ storiesLoading: false })
            toast.error(error.response?.data?.message);
        }
    },

    addStory : async(data) => {
        set({ storiesLoading: true })
        try {
            const res = await axios.post("/story/create-story",data)
            set((state) => ({ stories: [...state.stories , res.data] , user: res.data , storiesLoading: false }))
            console.log(res.data);
            toast.success("Story added successfully");
        } catch (error) {
            set({ storiesLoading: false })
            toast.error(error.response?.data?.message);
        }
    }
}))