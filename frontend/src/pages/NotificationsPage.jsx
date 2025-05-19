import { motion } from "framer-motion"
// import { useState } from "react";
import { FaRegHeart, FaTrash } from "react-icons/fa";
import {LiaCommentDots} from "react-icons/lia"
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns"; 
import { SlUserFollowing } from "react-icons/sl";
import { BsSnapchat } from "react-icons/bs";
// import { MdGroups } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";

const NotificationsPage = () => {

    const { user } = useAuthStore();

    const {notifications , getNotify} = useNotificationStore();

    useEffect(() => {
        getNotify(user?._id);
    }, [getNotify , user?._id]);
  
  return (
    <motion.div
      className="bg-base-300 shadow-xl sm:rounded-3xl sm:my-10 container mx-auto sm:px-8 px-4 py-8 max-w-3xl border border-base-200 relative overflow-hidden h-[calc(100vh-72px)] sm:h-auto"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >

      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/20 blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-secondary/20 blur-xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="text-center relative pb-2">
          {notifications.length > 0 && 
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full mb-1"></div>
          
          }
        <h1 className="font-extrabold sm:text-5xl text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Notifications
      </h1>
      <p className="mt-2 text-base-content/70">Your recent activities</p>
      </div>

      <div className="space-y-4 max-h-80 overflow-auto scroll-container">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className="mt-6 flex items-center justify-between p-4 bg-gradient-to-r from-base-100 to-gray-800 rounded-xl shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
                <div className="flex items-center justify-center gap-4">
                    {notification.type === "follow" && <SlUserFollowing size={18} className="text-info" />}
                    {notification.type === "like" && <FaRegHeart size={18} className="text-success"/>}
                    {notification.type === "comment" && <LiaCommentDots size={22} className="text-secondary"/>}
                    {notification.type === "chat" && <BsSnapchat size={18} className="text-primary" />}
                    {notification.type === "groupChat" && <HiOutlineUserGroup size={18} className="text-accent" />}
                    <p className="sm:text-md text-sm">{notification.message}</p>
                </div>
              <span className="text-xs sm:text-sm text-gray-500">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-12 w-12 text-primary" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
    />
  </svg>
  <p className="text-lg font-medium text-base-content/70">You&apos;re all caught up! 🎉</p>
</div>
        )}
      </div>

<div className="flex justify-center">
      {notifications.length > 0 && (
          <button
          className="mt-6 sm:w-1/2 px-5 sm:px-0 font-normal flex justify-center items-center gap-2 bg-gradient-to-b from-primary to-primary-focus text-primary-content py-3 rounded-xl"
        //   onClick={clearNotifications}
          >
          <FaTrash size={18} />
          Clear All Notifications
        </button>
      )}
      </div>
    </motion.div>
  )
}

export default NotificationsPage