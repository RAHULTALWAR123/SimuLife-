import { useState, useEffect } from "react";
import socket from "../socket/socket";
import { SlUserFollowing } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";
import { LiaCommentDots } from "react-icons/lia";
import { BsSnapchat } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";

const NotifyPop = () => {
  const [notification, setNotification] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const handleNotification = (data) => {
      console.log("Received notification:", data); // For debugging
      setNotification(data);
      setIsLeaving(false);
    };

    socket.on("like_notification", handleNotification);
    socket.on("follow_notification", handleNotification);
    socket.on("comment_notification", handleNotification);
    socket.on("message_notification", handleNotification);

    return () => {
      socket.off("like_notification", handleNotification);
      socket.off("follow_notification", handleNotification);
      socket.off("comment_notification", handleNotification);
      socket.off("message_notification", handleNotification);
    };
  }, []);

  useEffect(() => {
    let fadeTimer;
    let clearTimer;

    if (notification) {
      fadeTimer = setTimeout(() => {
        setIsLeaving(true);
      }, 4500);

      clearTimer = setTimeout(() => {
        setNotification(null);
        setIsLeaving(false);
      }, 5000);
    }

    return () => {
      if (fadeTimer) clearTimeout(fadeTimer);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, [notification]);

  if (!notification) return null;

  return (
    <div
      className={`
        fixed top-3 right-3
        bg-gradient-to-b from-primary to-primary-focus
        font-semibold text-primary-content px-6 py-3
        rounded-xl shadow-lg z-[9999]
        transition-opacity duration-500 ease-in-out
        ${isLeaving ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div className="flex items-center justify-center gap-4">
        {notification.type === "follow" && <SlUserFollowing size={18} className="text-primary-content" />}
        {notification.type === "like" && <FaRegHeart size={18} className="text-primary-content"/>}
        {notification.type === "comment" && <LiaCommentDots size={22} className="text-primary-content"/>}
        {notification.type === "chat" && <BsSnapchat size={18} className="text-primary-content" />}
        {notification.type === "groupChat" && <HiOutlineUserGroup size={18} className="text-primary-content" />}
        <p className="text-md">{notification.message}</p>
      </div>
    </div>
  );
};

export default NotifyPop;