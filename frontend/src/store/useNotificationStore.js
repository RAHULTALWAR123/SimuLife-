import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    notificationsLoading: false,

    getNotify : async(id) => {
        set({ notificationsLoading: true })
        try {
            const res = await axios.get(`/notifications/get-notifications/${id}`);
            set({ notifications: res.data , notificationsLoading: false });
            console.log(res.data);
        } catch (error) {
            set({ notificationsLoading: false });
            toast.error(error.response.data.message);
        }
    }
}))