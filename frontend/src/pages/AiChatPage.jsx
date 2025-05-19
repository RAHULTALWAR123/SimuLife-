// import React from 'react'

import AiChat from "../components/AiChat"
import { motion } from "framer-motion"
// import Chat from "../components/Chat"
import Companions from "../components/Companions"
import { useEffect, useState } from "react";
// import Users from "../components/Users"

const AiChatPage = () => {
  const [smallscreen, setSmallscreen] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

      useEffect(() => {
        const checkScreenSize = () => {
          setIsMobile(window.innerWidth < 768);
        };
    
        // Use requestAnimationFrame for smoother updates
        const handleResize = () => {
          requestAnimationFrame(checkScreenSize);
        };
    
        // Check immediately and set up listener
        checkScreenSize();
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="container sm:mx-auto sm:px-2 sm:pt-10 sm:max-w-4xl max-w-md">
        <div className="flex gap-1">
          {isMobile ? (
            <>
              {smallscreen === 1 && <Companions setSmallscreen={setSmallscreen} />}
              {smallscreen === 2 && <AiChat setSmallscreen={setSmallscreen} isMobile={isMobile} />}
            </>
          ) : (
            <>
              <Companions setSmallscreen={setSmallscreen} />
              <AiChat setSmallscreen={setSmallscreen} isMobile={isMobile} />
            </>
          )}
        </div>
    </motion.div>
  )
}

export default AiChatPage
