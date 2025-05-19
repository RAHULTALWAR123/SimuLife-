/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useMessageStore } from "../store/useMessageStore";
import { FiTrash2, FiUser, FiUsers} from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";

const DeleteChat = ({setShowDeleteChat , setSmallscreen , isMobile}) => {
  const { selectedUser , delChat} = useMessageStore();

  

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 20,
        scale: 0.98
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 150
        }
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: { 
          duration: 0.2
        }
      }}
      className="sm:w-1/3 w-full p-6 pt-14 sm:rounded-2xl bg-base-300 shadow-xl backdrop-blur-lg border border-gray-700 sm:h-[550px] h-screen" 
    
    >
      {isMobile && (
      <button>
      <IoChevronBack size={20}  className="absolute top-4 left-4 text-primary" onClick={() => setSmallscreen(2)} />
      </button>  
      )}
      {/* Header Section */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <img 
            src={selectedUser?.profilePic || "/avatar.jpg"} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20" 
          />
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-content rounded-full p-2">
            <FiUser size={16} />
          </div>
        </div>

        <h1 className="text-2xl font-bold mt-4 text-center">{selectedUser?.name}</h1>
        <p className="text-sm opacity-70">@{selectedUser?.email || "user123"}</p>
      </div>

      {/* Stats Section */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <FiUsers className="opacity-70" />
          <span>{selectedUser?.followers?.length || 0} followers</span>
        </div>
        <div className="flex items-center gap-1">
          <FiUser className="opacity-70" />
          <span>{selectedUser?.following?.length || 0} following</span>
        </div>
      </div>

      <div className="border-b border-primary my-4"></div>

      {/* Bio Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-sm opacity-90">{selectedUser?.bio || "No bio available"}</p>
      </div>

      {/* Last Messages Preview */}
     

      {/* Delete Action Section */}
      
        
        <motion.button
        onClick={() => {delChat(selectedUser?._id),setShowDeleteChat(false)}}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary/20 text-primary py-3 rounded-xl flex items-center justify-center w-full gap-2"
        >
          <FiTrash2 /> Delete All Messages
        </motion.button>
    </motion.div>
  );
};

export default DeleteChat;
