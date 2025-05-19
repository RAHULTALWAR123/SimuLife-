/* eslint-disable react/prop-types */
// import React from 'react'

import { Loader, Send } from "lucide-react"
import { useMessageStore } from "../store/useMessageStore"
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { IoCameraOutline, IoChevronBack, IoSettingsOutline } from "react-icons/io5";
import socket from "../socket/socket";

import {FaSnapchatGhost} from "react-icons/fa"
import Squares from "./Squares";
// import { Link } from "react-router-dom";
import { motion } from "framer-motion"
// import { text } from "express";

const Chat = ({showDeleteChat , setShowDeleteChat , setSmallscreen , isMobile}) => {

  const {selectedUser , getConversation, getMessage , messages , convoUser , sendMessages , sendMessageLoading , messageLoading , addMessage} = useMessageStore()
  const {user} = useAuthStore();
  // const [text,setText] = useState("");
  const [newPlayer, setNewPlayer] = useState({
    text: "",
    img: "",
  })

  const messageEndRef = useRef(null);


  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  useEffect(() => {
    if(selectedUser?._id){
      getConversation(selectedUser?._id);
    }
  }, [getConversation , selectedUser?._id]);

  useEffect(() => {
    if(convoUser?.conversationId){
      getMessage(convoUser?.conversationId);
    }
  }, [getMessage , convoUser?.conversationId]);



  useEffect(() => {
    socket.on("receive_message", (message) => {
      addMessage(message);
    })

    return () => {
      socket.off("receive_message");
    }

  }, [addMessage]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(text);
    console.log(newPlayer);
    if (!selectedUser) return;

    // setLastText(newPlayer.text);
try{
    await sendMessages(newPlayer,selectedUser?._id);
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
    <>
      {!selectedUser?._id ? (
        <motion.div 
        initial={{ 
          opacity: 0, 
          x: 100,
          scale: 0.95,
          rotate: 2
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
          rotate: 0,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            mass: 0.5,
            restDelta: 0.001
          }
        }}
        exit={{
          opacity: 0,
          x: -50,
          transition: { 
            duration: 0.3,
            ease: "easeInOut"
          }
        }}
        whileTap={{
          scale: 0.98,
          rotate: -1
        }}
        viewport={{ once: false, margin: "0px 0px -50px 0px" }}
        className="relative flex flex-col items-center justify-center w-2/3 mx-auto px-8 py-12 rounded-2xl bg-base-300 shadow-xl text-center space-y-2"
      >
        {/* Glowing background blur behind the icon */}
        <div className="relative">
          <div className="absolute inset-0 z-0 bg-primary/20 rounded-full blur-xl scale-125"></div>
          <FaSnapchatGhost size={64} className="relative z-10 text-primary drop-shadow-lg" />
        </div>
      
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Select a User
        </h1>
        <p className="text-sm text-base-content font-medium max-w-md">
  Choose someone you&lsquo;d like to chat with. Start a conversation, and build connections in a fun and friendly way.
</p>
      </motion.div>
      ) : (
        <motion.div 
        initial={{ 
          opacity: 0, 
          x: 100,
          scale: 0.95,
          rotate: 2
        }}
        animate={{
          opacity: 1,
          x: 0,
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
          x: -50,
          transition: { 
            duration: 0.3,
            ease: "easeInOut"
          }
        }}

        whileTap={{
          scale: 0.98,
          rotate: -1
        }}
        viewport={{ once: false, margin: "0px 0px -50px 0px" }}
        className="group relative sm:w-2/3 w-full sm:rounded-2xl text-primary-content bg-base-300/50 z-0 shadow-xl backdrop-blur-lg border border-gray-700 sm:h-[550px] h-[calc(100vh-70px)] overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30">
          <Squares
            speed={0.5} 
            squareSize={40}
            direction='diagonal'
            borderColor='#fff'
            hoverFillColor='#222'
          />
        </div>

        {messageLoading && (

    <div className="flex justify-center items-center h-full">
                <Loader className='h-16 w-16 animate-spin text-primary' aria-hidden='true' />
    </div>
  
)}

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex w-full h-16 p-5 items-center gap-5 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 rounded-t-xl text-base-content border-b border-primary">
          <div className="flex justify-between w-full">
          <div className="flex items-center gap-2 sm:gap-4">
            {isMobile && (
            <button >
          <IoChevronBack fontSize={20} className="text-primary" onClick={() => setSmallscreen(1)} />
            </button>  
            )}
            <img src={selectedUser?.profilePic || "/avatar.jpg"} alt="" className="w-9 h-9 rounded-full" />
            <p className="font-bold">{selectedUser?.name}</p>
          </div>
                  <button className="rounded-full px-2 py-2 font-extrabold"
                  onClick={() => {setShowDeleteChat(!showDeleteChat);setSmallscreen(3)}}
                  >
                    <IoSettingsOutline
                    size={28} fontSize={28} className="text-primary"/>
                  </button>
               
          </div>
          </div>
  
          <div className="overflow-y-scroll scroll-container px-1" style={{height:"75%"}}>
            {messages.map((message) => (
              <div key={message?._id} className={`flex gap-1 p-1 ${message?.sender === user?._id || message.senderId === user?._id ? "justify-end" : "justify-start"}`}>
                {!message?.img && (
                  <div className={`rounded-t-3xl p-3 shadow-sm max-w-64 ${message?.sender === user?._id || message.senderId === user?._id ? "bg-primary text-primary-content rounded-l-3xl" : "bg-base-100 text-base-content rounded-r-3xl"}`}>
                    <p className="text-md">{message?.text}</p>
                  </div>
                )}
                <div>
                  {message?.img && (
                    <img src={message?.img} alt="" className="w-44 h-44 rounded-3xl" />
                  )}
                </div>
              </div>
            ))}
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
                <label htmlFor="image">
                  <IoCameraOutline size={24} className="cursor-pointer"/>
                </label>
              </div>
              <button className="btn btn-primary rounded-full h-10" onClick={handleSubmit}>
                {sendMessageLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            {newPlayer.img && (
              <div className="text-right text-xs text-primary font-medium">
                <p>Image Uploaded</p>
              </div>
            )}
          </div>
        </div>
        </motion.div>
      )}
    </>
  );
}

export default Chat
