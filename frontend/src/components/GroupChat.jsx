// import React from 'react'

import { Loader, Send } from "lucide-react"
// import { useMessageStore } from "../store/useMessageStore"
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { IoCameraOutline, IoSettingsOutline } from "react-icons/io5";
import { useGroupStore } from "../store/useGroupStore";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import {motion} from "framer-motion"
import Squares from "./Squares";
import GroupInfo from "./GroupInfo"


const GroupChat = () => {

//   const {messageLoading} = useMessageStore()
  const {user} = useAuthStore();
  const {startGroupConvo , groupConvo , getGroupMessage , groupMessages , groupSendMessages , groupMessageLoading , MessageLoading , resetGroupMessages , addGroupMessage} = useGroupStore();

  const {id} = useParams();
  const [showInfo, setShowInfo] = useState(false);
  


  const [newPlayer, setNewPlayer] = useState({
    text: "",
    img: "",
  })

  useEffect(() => {
    return () => {
      resetGroupMessages();
    };
  }, [id, resetGroupMessages]);


  useEffect(() => {
    const initializeChat = async () => {
      await startGroupConvo(id);
    };
    if (id) {
      initializeChat();
    }
  }, [startGroupConvo, id]);



  useEffect(() => {
    const loadMessages = async () => {
      if (groupConvo?._id) {
        await getGroupMessage(groupConvo._id);
      }
    };
    loadMessages();
  }, [groupConvo?._id, getGroupMessage]);



  const messageEndRef = useRef(null);


  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

  useEffect(() =>{
    if(groupConvo?._id){
      socket.emit("join_group_chat",groupConvo._id);
    }
  },[groupConvo?._id])

  useEffect(() => {
    socket.on("receive_group_message",(message) =>{
      console.log("receive_group_message",message);
      addGroupMessage(message);
    })

    return () => {
      socket.off("receive_group_message");
    };
  }, [addGroupMessage]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    console.log(newPlayer);
    if (!groupConvo?._id) return;


try{
    await groupSendMessages(groupConvo?._id,newPlayer);
    setNewPlayer({ text: "", img: "" });
    // setText("");
}
catch(error){
    console.log(error);
}



  }

  const handleImageChange = (e) => {
      const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
      reader.onloadend = () => {
          setNewPlayer({ ...newPlayer, img: reader.result });
        };
      reader.readAsDataURL(file); // Convert to base64
    }
};



  return (
<motion.div
initial={{ 
  opacity: 0, 
  y: 100,
  scale: 0.95,
  rotate: 2
}}
animate={{
  opacity: 1,
  y: 0,
  scale: 1,
  rotate: 0,
  transition: {
    type: "spring",
    damping: 12,
    stiffness: 100,
    mass: 0.5,
    velocity: 2,
    restDelta: 0.001
  }
}}
exit={{
  opacity: 0,
  y: -50,
  transition: { 
    duration: 0.8,
    ease: "easeInOut"
  }
}}
// whileHover={{
//   scale: 1.03,
//   transition: { duration: 0.2 }
// }}
whileTap={{
  scale: 0.98,
  rotate: -1
}}
viewport={{ once: false, margin: "0px 0px -50px 0px" }}
className={`container sm:mx-auto sm:px-2 sm:pt-10 ${showInfo ? "max-w-6xl" : "max-w-4xl"} flex flex-col sm:flex-row sm:gap-1 gap-3`}>

      <div className="group relative overflow-hidden w-full sm:rounded-xl text-base-content bg-base-300/50  z-0 shadow-xl backdrop-blur-lg h-[calc(100vh-68px)] sm:h-[550px]">
      <div className="absolute inset-0 z-0 opacity-30">
          <Squares
            speed={0.5} 
            squareSize={40}
            direction='diagonal'
            borderColor='#fff'
            hoverFillColor='#222'
          />
        </div>

<div className="relative z-10 h-full flex flex-col">


<div className="flex w-full h-16 p-5 items-center justify-between gap-5 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 sm:rounded-t-xl text-base-content border-b border-primary">
  <div className="flex items-center gap-5">
    <img 
      src={groupConvo?.group?.logo || "/avatar.jpg"}  
      alt="" 
      className="w-9 h-9 rounded-full" 
    />
    <div className="flex flex-col">
      <p className="font-bold">{groupConvo?.group?.name}</p>
      <div className="flex items-center gap-1">
        <div className="flex -space-x-2 mt-2">
          {groupConvo?.group?.members?.slice(0, 3).map(member => (
            <img 
              key={member._id}
              src={member.profilePic || "/avatar.jpg"}
              alt={member.name}
              className="w-6 h-6 rounded-full border-2 border-base-100"
            />
          ))}
        </div>
        <p className="text-xs mt-2">
          {groupConvo?.group?.members?.length} members
        </p>
      </div>
    </div>
  </div>
  
  {/* Info button */}
   <button className="rounded-full px-2 py-2 font-extrabold"
                    onClick={() => setShowInfo(!showInfo)}
                    >
                      <IoSettingsOutline
                      size={28} fontSize={28} className="text-primary"/>
  </button>
</div>


        <div className="overflow-y-scroll scroll-container px-1" style={{height:"75%"}}>
            {groupMessageLoading && <Loader className="absolute top-1/2 left-1/2 animate-spin text-primary" />}
        {!groupMessageLoading && groupMessages.map((message) => {
    const isUser = message?.sender?._id === user?._id || message.senderId === user?._id;

    return (
        <div key={message?._id} className={`flex items-end gap-2 p-3 ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && (
                <img src={message?.sender?.profilePic || "/avatar.jpg"} alt="" className="w-9 h-9 rounded-full object-cover" />
            )}

            <div className="flex flex-col gap-1 max-w-80">

                {message?.img && (
                    <img src={message?.img} alt="" className="w-44 h-44 md:w-60 md:h-60 rounded-2xl object-cover shadow-md" />
                )}

            
                {!message?.img && (
                    <div className={`p-3 text-md shadow-sm rounded-3xl break-words ${isUser ? "bg-primary text-primary-content rounded-br-none" : "bg-secondary text-secondary-content rounded-bl-none"}`}>
                        <p className="font-medium">{message?.text}</p>
                    </div>
                )}
            <p className={`text-xs ${isUser ? "text-right" : "text-left"}`}>{message?.sender?.name}</p>
            </div>

        
            {isUser && (
                <img src={message?.sender?.profilePic || "/avatar.jpg"} alt="" className="w-9 h-9 rounded-full object-cover" />
            )}
        </div>
    );
})}

            <div ref={messageEndRef}/>
        </div>



        <div className="absolute w-full bottom-0 p-4 bg-base-200/70">
                  <div className="flex gap-2 items-center relative">
                    <input
                      type="text"
                      value={newPlayer.text}
                      onChange={(e) => setNewPlayer({ ...newPlayer, text: e.target.value })}
                      className="input input-bordered flex-1 text-sm h-10 text-primary rounded-xl"
                      placeholder="Type a message..."
                      />
                    <div className="absolute right-16">
                    <input
            type="file"
            id="image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            />
          <label
            htmlFor="image"
            // className="px-8 py-3 bg-base-100 text-base-content w-1/3 rounded-2xl flex gap-2 items-center cursor-pointer"
            >
          <IoCameraOutline size={24} className="cursor-pointer"/>
          </label>
          </div>
                      
                    <button className="btn btn-primary rounded-full h-10" onClick={handleSubmit}>
                      {MessageLoading ? (
                        <>
                        <Loader className='h-5 w-5 animate-spin' aria-hidden='true' />
                        </> 
                      ) : (
                          <Send size={18} />
                      )}
                    </button>
                  </div>
                  {newPlayer.img &&
                <div className="text-right text-xs text-primary font-medium">
                  <p>Image Uploaded</p>
                </div>
                  }
                </div>
        </div>

    </div>

    {/* <div> */}
      {showInfo && <GroupInfo groupConvo={groupConvo} id={id}/>}
    {/* </div> */}
        </motion.div>
  )
}

export default GroupChat
