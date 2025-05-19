import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import DeleteChat from "../components/DeleteChat";
import Users from "../components/Users";

const ChatPage = () => {
  const [showDeleteChat, setShowDeleteChat] = useState(false);
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
    <div className={`container sm:mx-auto sm:px-2 sm:pt-10  ${showDeleteChat ? "sm:max-w-6xl" : "sm:max-w-4xl max-w-md"}`}>
      <div className="flex gap-1">
        {isMobile ? (
          <>
            {smallscreen === 1 && <Users setSmallscreen={setSmallscreen} />}
            {smallscreen === 2 && (
              <Chat 
                showDeleteChat={showDeleteChat} 
                setShowDeleteChat={setShowDeleteChat} 
                setSmallscreen={setSmallscreen}
                isMobile={isMobile}
              />
            )}
            {smallscreen === 3 && showDeleteChat && (
              <DeleteChat setShowDeleteChat={setShowDeleteChat} isMobile={isMobile} setSmallscreen={setSmallscreen} />
            )}
          </>
        ) : (
          <>

              <Users setSmallscreen={setSmallscreen} />
           
              <Chat 
                showDeleteChat={showDeleteChat} 
                setShowDeleteChat={setShowDeleteChat} 
                setSmallscreen={setSmallscreen}
                isMobile={isMobile}
              />

            {showDeleteChat && (

                <DeleteChat setShowDeleteChat={setShowDeleteChat}  isMobile={isMobile} setSmallscreen={setSmallscreen} />
              
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;