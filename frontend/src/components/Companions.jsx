/* eslint-disable react/prop-types */
// import React from 'react'

import { useEffect } from "react";
import { useCompanionStore } from "../store/useCompanionStore"
// import { RiOpenaiFill } from "react-icons/ri";
import { FaTheaterMasks } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Loading from "./Loading";

const Companions = ({setSmallscreen}) => {

    const {getCompanion, companions,setSelectedCompanion, setSelectCompId ,companionsLoading} = useCompanionStore();

    useEffect(() => {
        getCompanion();
    }, [getCompanion]);
 
     const handleSelectCompanion = (companion) => {
    setSelectedCompanion(companion);
    setSelectCompId(companion?._id);

  };

  if(companionsLoading) return <Loading/>
  



  return (
    <motion.div 
    initial={{ 
      opacity: 0, 
      x: -100,
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
      rotate: 1
    }}
    viewport={{ once: false, margin: "0px 0px -50px 0px" }}
    className="sm:w-1/3 w-full p-6 sm:rounded-2xl bg-base-300 shadow-xl backdrop-blur-lg border border-gray-700 sm:h-[550px] h-[calc(100vh-68px)] overflow-hidden" >
      
        {companions.length === 0 ? (

                    <motion.div 
  className="my-24 sm:my-20 px-2"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div className="flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto">
   
    <motion.div 
      className="relative w-24 h-24 flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 z-0 bg-primary/20 rounded-full blur-xl scale-125 animate-pulse"></div>
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
          y: [0, -8, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <FaTheaterMasks size={60} className="relative z-10 text-primary drop-shadow-lg" />
      </motion.div>
    </motion.div>

    <div className="text-center space-y-4">
      <motion.h1 
        className="font-extrabold text-3xl sm:text-3xl bg-primary bg-clip-text text-transparent leading-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Craft Your Unique AI Companion
      </motion.h1>
      
      <motion.p 
        className="text-sm font-bold text-base-content/80 max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Bring your imagination to life with our AI character creator
      </motion.p>
    </div>

    <motion.div
      className="mt-2 w-full max-w-xs"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      <Link to="/explore" className="block">
        <button className="btn btn-primary btn-md w-full group relative overflow-hidden">
          <span className="relative z-10 flex items-center justify-center">
            <span className="group-hover:scale-105 transition-transform">Explore Creation</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </Link>
    </motion.div>

    
  </div>
</motion.div>

        ) : 
        (
        <>
        <h1 className="text-center font-extrabold text-3xl text-primary">Companions</h1>

        <div className="flex flex-col gap-4 mt-6 h-4/5 overflow-auto scroll-smooth px-2 scroll-container">
            {companions.map((user) => (
                <button onClick={() => {handleSelectCompanion(user); setSmallscreen(2);}} className="flex gap-4 items-center bg-gradient-to-tr from-base-100 to-primary/10 p-3 rounded-2xl hover:scale-105 transition-transform duration-200 shadow-lg" key={user?._id}>
                    <img src={user?.img} alt="" className="w-12 h-12 rounded-full shadow-md"/>
                    <h1 className="text-left font-semibold">{user?.name}</h1>
                </button>
            ))}
        </div>

        <div className="mb-5">
            <Link to="/explore">
            <button className="rounded-xl bg-gradient-to-r from-primary to-secondary p-3 text-primary-content w-full flex justify-center items-center gap-2 font-medium hover:scale-105 transition-transform duration-200 shadow-lg"><span><FaTheaterMasks size={20}/></span> Explore more</button>
            </Link>
        </div>
        </>
        )
}
    </motion.div>
  )
}

export default Companions
