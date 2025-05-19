/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FiLogOut, FiUsers} from "react-icons/fi";
import { useGroupStore } from "../store/useGroupStore";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const GroupInfo = ({groupConvo,id}) => {

    const {leavegroup} = useGroupStore()
    const navigate = useNavigate();
    const {user} = useAuthStore();

    const handleLeaveGroup = async() => {
        const success = await leavegroup(id);
        if (success) {
          navigate('/group'); 
        }
    };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", damping: 20, stiffness: 150 }
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="sm:w-1/3 w-full p-6  sm:rounded-2xl bg-base-300 shadow-xl backdrop-blur-lg border border-gray-700"
      style={{ height: "550px" }}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <img 
            src={groupConvo?.group?.logo || "/avatar.jpg"} 
            alt="Group Logo" 
            className="w-28 h-28 rounded-full object-cover border-4 border-primary/20" 
          />
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-content rounded-full p-2">
            <FiUsers size={16} />
          </div>
        </div>

        <h1 className="text-2xl font-bold mt-4 text-center">{groupConvo?.group?.name}</h1>
        <Link to={`/userProfile/${groupConvo?.group?.owner?._id}`}>
        <p className="text-sm opacity-70 hover:underline">Created by @{groupConvo?.group?.owner?.name}</p>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <FiUsers className="opacity-70" />
          <span>{groupConvo?.group?.members?.length} members</span>
        </div>
      </div>

      <div className="border-b border-primary my-4"></div>

      

      {/* Members Section */}
      <div className="mb-4 max-h-40 overflow-y-auto">
        <h3 className="font-semibold mb-2 text-primary">Members</h3>
        <div className="space-y-2">
          {groupConvo?.group?.members?.map(member => (
            <div key={member._id} className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg">
              <img 
                src={member.profilePic || "/avatar.jpg"} 
                alt={member.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                {/* <p className="text-xs opacity-70 capitalize">{member.role}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>

{user._id !== groupConvo?.group?.owner?._id && (
    
      <div className="mt-6 space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary/20 text-primary py-3 rounded-xl flex items-center justify-center w-full gap-2"
          onClick={handleLeaveGroup}
        >
          <FiLogOut /> Exit Group
        </motion.button>
      </div>
)}
        
        {/* <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary/20 text-primary py-3 rounded-xl flex items-center justify-center w-full gap-2"
        >
          <FiTrash2 /> Delete All Messages
        </motion.button> */}
    </motion.div>
  );
};

export default GroupInfo;