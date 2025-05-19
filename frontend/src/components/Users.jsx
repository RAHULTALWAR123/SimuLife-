/* eslint-disable react/prop-types */
import { useEffect } from "react";
// import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import { MdGroups } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPeopleGroup } from "react-icons/fa6";
import Loading from "./Loading";

const Users = ({setSmallscreen}) => {
  const { getfriends , friends,friendLoading} = useAuthStore();
  const { user, onlineUsers } = useAuthStore();
  const { setSelectedUser } = useMessageStore();


  useEffect(() => {
    getfriends(user?._id);
  }, [getfriends, user?._id]);

  // Debug current online users
  console.log("Current online users:", Array.from(onlineUsers));

  if(friendLoading) return <Loading/> 

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -100,
        scale: 0.95,
        rotate: 2,
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
          restDelta: 0.001,
        },
      }}
      exit={{
        opacity: 0,
        x: -50,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
        },
      }}
      whileTap={{
        scale: 0.98,
        rotate: 1,
      }}
      viewport={{ once: false, margin: "0px 0px -50px 0px" }}
      className="sm:w-1/3 w-full  p-6 sm:rounded-2xl bg-base-300 shadow-xl backdrop-blur-lg border border-gray-700 sm:h-[550px] h-[calc(100vh-68px)] overflow-hidden" 
    >
    {/* {friendLoading && <Loading/>} */}
      {friends.length === 0 ? (
        <motion.div 
  className="my-24 sm:my-20"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div className="flex flex-col items-center justify-center gap-6">
  
    <motion.div 
      className="relative w-32 h-32 flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 z-0 bg-primary/20 rounded-full blur-xl scale-125 animate-pulse"></div>
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <FaPeopleGroup size={72} className="relative z-10 text-primary drop-shadow-lg" />
      </motion.div>
    </motion.div>

    {/* Text content */}
    <div className="text-center max-w-md px-4 space-y-3">
      <motion.h1 
        className="font-bold text-3xl sm:text-4xl bg-primary bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Start Connecting
      </motion.h1>
      
      <motion.p 
        className="text-lg text-base-content/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Follow users to unlock conversations and build your network
      </motion.p>
    </div>

    {/* CTA Button */}
    
  </div>
</motion.div>
      ) : (
        <>
          <h1 className="text-center font-extrabold text-3xl text-primary">
            Messages
          </h1>

          <div className="flex flex-col gap-4 mt-6 h-4/5 overflow-auto scroll-smooth px-2 scroll-container">
            {friends.map((followedUser) => {
              // For each user, check if they're online
              const isUserOnline = onlineUsers.has(followedUser._id);
              
              // Debug individual user status
              console.log(`User ${followedUser.name} (${followedUser._id}) online status:`, isUserOnline);
              
              return (
                <button
                  key={followedUser._id}
                  onClick={() => {setSelectedUser(followedUser) ; setSmallscreen(2)}}
                  className="flex gap-4 items-center bg-gradient-to-tr from-base-100 to-primary/10 p-3 rounded-2xl hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={followedUser?.profilePic || "/avatar.jpg"}
                      alt=""
                      className="w-12 h-12 rounded-full shadow-md"
                    />
                    {isUserOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-base-300 rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-left text-base-content font-semibold">
                      {followedUser?.name}
                    </h1>
                    <p className="text-sm text-gray-400">
                      {isUserOnline ? "Online" : ""}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <Link to="/group" className="mt-4">
            <button className="rounded-xl bg-gradient-to-r from-primary to-secondary p-3 text-primary-content w-full flex justify-center items-center gap-2 font-medium hover:scale-105 transition-transform duration-200 shadow-lg">
              <MdGroups size={28} />
              <p className="text-lg">Groups</p>
            </button>
          </Link>
        </>
      )}
    </motion.div>
  );
};

export default Users;