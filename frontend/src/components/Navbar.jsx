// import React from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { GoHomeFill } from "react-icons/go"
import { IoSearch, IoSettings } from "react-icons/io5"
import { CgAddR } from "react-icons/cg"
// import { IoIosChatboxes } from "react-icons/io"
import { FaFacebookMessenger } from "react-icons/fa"
import { AiFillOpenAI } from "react-icons/ai"
import { MdOutlineFileDownloadDone } from "react-icons/md"
import { FaUserEdit } from "react-icons/fa"
import { IoNotifications } from "react-icons/io5"
import { FaInstagram } from "react-icons/fa"
import { TiThMenu } from "react-icons/ti"
import { FaCartShopping } from "react-icons/fa6"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { useCompanionStore } from "../store/useCompanionStore"


const Navbar = () => {
    const [isOpen, setIsOpen] = useState("false") 

    const handleToggle = () => setIsOpen(!isOpen)

    const {logout,user} = useAuthStore()
    const {setSelectedCompanion,setSelectCompId} = useCompanionStore()
    

  return (
    <div className="fixed z-10">
        <motion.div animate={{width: isOpen ? "14rem" : "3.5rem", padding: isOpen ? "1rem" : "1rem", transition: {duration: 0.2,type:"spring" ,damping:9}}} className="bg-base-300  h-screen">
            <div className="flex justify-between mb-10">
            {isOpen && <FaInstagram size={40}/>}
            <TiThMenu size={40} onClick={handleToggle}/>
            </div>
            <section className="flex flex-col gap-4">
                <Link to={`/profile/${user?._id}`}>
                <div className="flex items-center gap-2">
                <FaUserEdit size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Edit Profile</motion.p>}
                </AnimatePresence>
                </div>
                </Link>
                <Link to="/">
                <div className="flex items-center gap-2">
                <GoHomeFill size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Home</motion.p>}
                </AnimatePresence>
                </div>
                </Link>
                <div className="flex items-center gap-2">
                    <IoSearch size={24}/>
                    <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Search</motion.p>}
                    </AnimatePresence>
                </div>
                <Link to="/create-options">
                <div className="flex items-center gap-2">
                    <CgAddR size={24}/>
                    <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Create</motion.p>}
                    </AnimatePresence>
                </div>
                </Link>
                <Link to="/chat">
                <div className="flex items-center gap-2">
                <FaFacebookMessenger size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Messages</motion.p>}
                </AnimatePresence>
                </div>
                </Link>
                <Link to="/Ai-chat">
                <div className="flex items-center gap-2">
                <AiFillOpenAI size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Ai Companion</motion.p>}
                </AnimatePresence>
                </div>
                </Link>
                <div className="flex items-center gap-2">
                <MdOutlineFileDownloadDone size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Downloads</motion.p>}
                </AnimatePresence>
                </div>
                <div className="flex items-center gap-2">
                <IoNotifications size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Notifications</motion.p>}
                </AnimatePresence>
                </div>
            </section>
            <section className="flex flex-col mt-10 gap-4">
                <div className="border-b border-base-content"></div>
                <Link to="/settings">
                <div className="flex items-center gap-2">
                <IoSettings size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Settings</motion.p>}
                </AnimatePresence>
                </div>
                </Link>
                <Link to="/purchases">
                <div className="flex items-center gap-2">
                <FaCartShopping size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Purchases</motion.p>}
                </AnimatePresence>
                </div>
                </Link>
                <button className="flex items-center gap-2" onClick={() => {logout(); setSelectedCompanion(null) ; setSelectCompId(null)}}>
                <FaCartShopping size={24}/>
                <AnimatePresence>
                    {isOpen && <motion.p className="font-bold text-lg">Logout</motion.p>}
                </AnimatePresence>
                </button> 
                { user?.isPro &&
                <button className="bg-gradient-to-l from-primary via-secondary via-accent to-neutral px-3 py-2 rounded-3xl text-primary-content w-3/4 flex justify-center items-center shadow-md shadow-primary transition duration-300">
                <AnimatePresence>
                    {user?.isPro && isOpen && <motion.p className="font-bold text-lg">Subscribed</motion.p>}
                </AnimatePresence>
                </button>
}
            </section>
        </motion.div>
    </div>
  )
}

export default Navbar
