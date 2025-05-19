/* eslint-disable react/prop-types */
// import React from 'react'

import { Loader, Send } from "lucide-react"
import { IoAddCircleOutline, IoChevronBack } from "react-icons/io5"
import {RiOpenaiFill, RiVipCrownLine} from "react-icons/ri"
import { useCompanionStore } from "../store/useCompanionStore"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import TrialModal from "./TrialModal"
import Squares from "./Squares"
import { motion } from "framer-motion"



const AiChat = ({setSmallscreen , isMobile}) => {
    const {selectedCompanion, getConvo,aimessageLoading,aiMessages, convoCompanion,getAiMessages,sendAiMessage,sendMessageLoading ,compUser} = useCompanionStore()
    const {user} = useAuthStore()

    const [message, setMessage] = useState("")
    const [isOpen , setIsOpen] = useState(false)
    const messageEndRef = useRef(null);

    const navigate = useNavigate()

    const isSubscriptionActive = user?.subscriptionEnd && new Date(user.subscriptionEnd) > new Date();

    const handleCreateClick = () => {
      if (!isSubscriptionActive) {
        navigate('/subscribe-ai');
        return;
      }
      navigate('/create-comp');
    };

    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [aiMessages]);

    const sendMessage = async(e) => {
      e.preventDefault();
    if (!message.trim() || !convoCompanion) return;

    try {
      await sendAiMessage(convoCompanion, message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }

}

const handleModal = () => {
  setIsOpen(true);
}




    useEffect(() => {
      if(selectedCompanion?._id){
        getConvo(selectedCompanion?._id)
      }
    }
    , [getConvo, selectedCompanion?._id])
  

    useEffect(() => {
      if(convoCompanion){
        getAiMessages(convoCompanion)
      }
      
    },[convoCompanion, getAiMessages])

  return (
    <>
    {!selectedCompanion?._id ? (
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
    <RiOpenaiFill size={64} className="relative z-10 text-primary drop-shadow-lg" />
  </div>

  <h1 className="text-3xl font-extrabold text-primary tracking-tight">
    Select a Companion
  </h1>
  <p className="text-sm text-base-content font-medium max-w-md">
    Choose someone to talk to and share your thoughts, feelings, or just have fun with an AI friend.
  </p>
</motion.div>

    ) : (
      <>
     {isOpen && <TrialModal setIsOpen={setIsOpen} />}
      
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
              // whileHover={{
              //   scale: 1.03,
              //   transition: { duration: 0.2 }
              // }}
              whileTap={{
                scale: 0.98,
                rotate: -1
              }}
              viewport={{ once: false, margin: "0px 0px -50px 0px" }}
      className="group relative overflow-hidden sm:w-2/3 w-full mx-auto sm:rounded-2xl text-primary-content bg-base-300/50 z-0 shadow-xl backdrop-blur-lg border border-gray-700 h-[calc(100vh-68px)] sm:h-[550px]" >
        {/* Background Squares */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Squares
            speed={0.5} 
            squareSize={40}
            direction='diagonal'
            borderColor='#fff'
            hoverFillColor='#222'
          />
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex w-full h-16 p-5 items-center gap-5 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 rounded-t-xl text-base-content border-b border-primary">
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-4">
               {isMobile && (
                 
                 <button onClick={() => setSmallscreen(1)}>
                           <IoChevronBack fontSize={20} className="text-primary" />
                 </button>  
               
               )}
                <img src={selectedCompanion?.img} alt="" className="w-9 h-9 rounded-full" />
                <p className="text-lg font-bold">{selectedCompanion?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/subscribe-ai">
                  <button className="rounded-full px-2 py-2 font-extrabold">
                    <RiVipCrownLine size={32} fontSize={28} className="text-primary"/>
                  </button>
                </Link>
                
                {(!compUser?.isPro && !user?.isPro && ((compUser?.freeLimit ?? user?.freeLimit) === 0)) && (
                  <button className="rounded-full px-2 py-2 font-extrabold" onClick={handleModal}>
                    <IoAddCircleOutline size={32} fontSize={40} className="text-primary" />
                  </button>
                )}
                
                {((compUser?.isPro ?? user?.isPro) || ((compUser?.freeLimit ?? user?.freeLimit) > 0)) && (
                  // <Link to="/create-comp">
                    <button className="rounded-full px-2 py-2 font-extrabold" onClick={handleCreateClick}>
                      <IoAddCircleOutline size={32} fontSize={40} className="text-primary" />
                    </button>
                  // </Link>

                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="overflow-y-scroll scroll-container px-1 flex-1">
            {aimessageLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader className='h-12 w-12 animate-spin text-primary' aria-hidden='true' />
              </div>
            ) : (
              <>
                {aiMessages.map((message) => (
                  <div key={message?._id} className={`flex gap-1 p-1 ${message?.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded-t-3xl p-3 shadow-sm max-w-64 ${message?.sender === "user" ? "bg-primary text-primary-content rounded-l-3xl" : "bg-base-100 text-base-content rounded-r-3xl"}`}>
                      <p className="text-md font-semibold">
                      {message?.content}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="w-full p-4 bg-base-200/70">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input input-bordered flex-1 text-sm h-10 text-primary rounded-xl"
                placeholder="Type a message..."
              />
              <button 
                className="btn btn-primary rounded-full h-10" 
                onClick={sendMessage}
                disabled={sendMessageLoading}
              >
                {sendMessageLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      </>

    )}


    </>
  )
}

export default AiChat
