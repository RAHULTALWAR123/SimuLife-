import { useEffect, useState } from "react";
import { FaFacebookMessenger, FaUserEdit } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { CgAddR } from "react-icons/cg";
import { IoNotifications, IoSettings } from "react-icons/io5";
import Dock from "./Dock";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { FaCartShopping } from "react-icons/fa6";
import { AiFillOpenAI } from "react-icons/ai";


const Navbar2 = () => {
  const navigate = useNavigate();
  const { user} = useAuthStore();


  // State to track screen size
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  // Effect to add resize event listener
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    // Add the resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup the listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    { 
      icon: <GoHomeFill size={isSmallScreen ? 16 : 24} />, 
      label: "Home", 
      onClick: () => navigate("/") 
    },
    { 
      icon: <FaUserEdit size={isSmallScreen ? 16 : 24}/>, 
      label: "Profile", 
      onClick: () => navigate(`/profile/${user?._id}`) 
    },
    { 
      icon: <CgAddR size={isSmallScreen ? 16 : 24}/>, 
      label: "Create", 
      onClick: () => navigate("/create-options") 
    },
    { 
      icon: <FaFacebookMessenger size={isSmallScreen ? 16 : 24}/>, 
      label: "Chat", 
      onClick: () => navigate("/chat") 
    },
    { 
      icon: <AiFillOpenAI size={isSmallScreen ? 16 : 24} />, 
      label: "AI Chat", 
      onClick: () => navigate("/Ai-chat") 
    },
    { 
      icon: <IoNotifications size={isSmallScreen ? 16 : 24}/>, 
      label: "Notifications", 
      onClick: () => navigate("/notifications") 
    },
    { 
      icon: <FaCartShopping size={isSmallScreen ? 16 : 24}/>, 
      label: "Purchases", 
      onClick: () => user?.isPro ? navigate("/purchases") : navigate("/subscribe-ai") 
    },
    { 
      icon: <IoSettings size={isSmallScreen ? 16 : 24}/>, 
      label: "Settings", 
      onClick: () => navigate("/settings") 
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-full sm:px-2 sm:pb-1">
      <Dock
        items={items}
        // Mobile configurations
        smPanelHeight={64}
        smBaseItemSize={44}
        smMagnification={44}
        // Desktop configurations (unchanged)
        panelHeight={85}
        baseItemSize={65}
        magnification={90}
        // Adjust spacing for mobile
        className="sm:gap-4 gap-1"
      />
    </div>
  );
};

export default Navbar2;