import { FaUserEdit } from "react-icons/fa";
import { HiDotsHorizontal } from 'react-icons/hi';

import { usePostStore } from "../store/usePostStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useParams } from "react-router-dom";
import { BiSolidGrid } from "react-icons/bi";
import { IoImagesOutline } from "react-icons/io5"; // {IoTrashBinOutline }
import { RiVipCrown2Line } from "react-icons/ri";
import ExclusivePostPage from "./ExclusivePostPage";
import {motion} from "framer-motion"
import { FiPlus } from "react-icons/fi";
import Loading from "../components/Loading";

const UserProfilePage = () => {
    const { getUserPosts , userPosts , postsLoading } = usePostStore();
    const {user} = useAuthStore();
    const {id} = useParams();
    const [activeTab, setActiveTab] = useState(1);

    useEffect(() => {
        getUserPosts(id);
    }, [getUserPosts , id]);

  const tabs = [
          {id:1,icon:<BiSolidGrid  className="sm:text-4xl text-3xl"/>},
          {id:2,icon:<RiVipCrown2Line className="sm:text-4xl text-3xl"/>}
  ]
    

  return (
    <div className="container sm:mx-auto sm:px-4 pt-10 sm:max-w-xl rounded-lg shadow-sm ">
      <div className="sm:px-16 px-5  flex sm:gap-10 gap-4 items-center">
        {/* Profile Image */}
        <img
          src={user?.profilePic || "/avatar.jpg"}
          alt="Profile"
          className="sm:w-24 sm:h-24 h-14 w-14 rounded-full object-cover"
        />

        {/* User Info */}
        <div>
          {/* User Name */}
          <h1 className="sm:text-3xl text-lg font-bold mb-5">{user?.name}</h1>

          {/* Stats */}
          <div className="flex sm:gap-12 gap-6 mb-1">
            <div className="text-center">
              <p className="font-bold sm:text-2xl">{userPosts?.length}</p>
              <p className=" sm:text-lg">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold sm:text-2xl">{user?.followers?.length}</p>
              <p className=" sm:text-lg">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold sm:text-2xl">{user?.following?.length}</p>
              <p className=" sm:text-lg">Following</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:px-20 px-5 mt-5">
        <p className="sm:text-lg text-base-content/70 font-medium">{user?.bio}</p>
      </div>

      <div className="sm:px-16 px-5">
        {user?._id === id ? (
        <Link to={"/edit-profile"}>
        <button className="sm:px-28 sm:py-4 py-3 bg-primary mt-10 w-full text-primary-content sm:rounded-2xl rounded-3xl flex justify-center items-center gap-4">
          <FaUserEdit size={28} />
          <p className="font-bold sm:text-lg">Edit Profile</p>
        </button>
        </Link>
        ) : (
            // <Link to={"/edit-profile"}>
            <button className="px-28 py-4 bg-primary mt-10 w-full text-primary-content rounded-2xl flex justify-center items-center gap-4">
            <FaUserEdit size={28} />
            <p className="font-bold text-lg">Follow</p>
            </button>
            // </Link>
        )}
      </div>


      <div className="border-b border-primary mt-5"></div>

<div className="flex justify-between px-3 mt-3">
      {tabs.map((tab) => (
        <div key={tab.id} className="cursor-pointer flex items-center ">
          <button className={` ${activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-base-content"}`} onClick={() => setActiveTab(tab.id)}>
          {tab.icon}
          </button>
        </div>
      ))}
</div>

<div className="mt-10">

  {postsLoading && (
            <Loading/>
          )}
  


{activeTab === 1 && (
  <div className="space-y-8 mt-6">
    {/* Empty State */}
    {userPosts.length === 0 && (
      <motion.div
      initial={{ opacity: 0, x: 50}}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="relative mb-6">
          <IoImagesOutline className="text-primary" size={80} />
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-md"></div>
        </div>
        <h3 className="text-2xl font-bold text-base-content mb-2">No Posts Yet</h3>
        <p className="text-base-content/70 max-w-md mx-auto">
          {user?._id === id 
            ? "Share your first moment to get started!"
            : "This user hasn't shared anything yet."}
        </p>
        {user?._id === id && (
          <Link
            to="/create-post"
            className="mt-6 btn btn-primary gap-2 rounded-full px-6"
          >
            <FiPlus size={18} />
            Create Post
          </Link>
        )}
      </motion.div>
    )}

    {/* Posts Grid */}
    {userPosts.length > 0 && (
      <div className="grid grid-cols-1 gap-6">
        {userPosts.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: 50}}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="bg-base-300 rounded-2xl overflow-hidden shadow-sm border border-base-300/50 hover:shadow-md transition-shadow mx-2"
          >
            {/* Post Header */}
            <div className="flex justify-between items-center p-4">
              <Link 
                to={`/userProfile/${item.owner._id}`}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <img
                    src={item.owner.profilePic || "/avatar.jpg"}
                    className="h-10 w-10 rounded-full object-cover border-2 border-primary/10 group-hover:border-primary/30 transition-all"
                    alt={item.owner.name}
                  />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {item.owner.name}
                  </p>
                 
                </div>
              </Link>
              <button className="p-1 rounded-full hover:bg-base-200 transition-colors">
                <HiDotsHorizontal size={20} className="text-base-content/70" />
              </button>
            </div>

            {/* Post Image */}
            <div className="relative aspect-square bg-base-200">
              <img
                src={item.image}
                alt={item.caption || "Post image"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/30 to-transparent pointer-events-none"></div>
            </div>

            {/* Post Actions */}
            <div className="p-4">
              

              {/* Caption */}
              <div className="text-base">
                <Link 
                  to={`/userProfile/${item.owner._id}`}
                  className="font-semibold hover:text-primary transition-colors mr-1"
                >
                  {item.owner.name}
                </Link>
                <span>{item.caption}</span>
              </div>


            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
)}

        {activeTab === 2 && <ExclusivePostPage user={user} id={id}/>}
      </div>
    </div>
  );
};

export default UserProfilePage;
