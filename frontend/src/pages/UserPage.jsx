// import { FaUserEdit } from "react-icons/fa";
import {motion} from "framer-motion"
import { SlUserFollowing, SlUserUnfollow } from "react-icons/sl";
import { FaUserEdit } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';

import { BiSolidGrid } from "react-icons/bi";
import { RiVipCrown2Line } from "react-icons/ri";
import { usePostStore } from "../store/usePostStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
// import ExclusivePostPage from "./ExclusivePostPage";
import ExclusiveUserPostPage from "./ExclusiveUserPostPage";
import { IoImagesOutline } from "react-icons/io5";
import Loading from "../components/Loading";

const UserPage = () => {
    const { getUserPosts , userPosts,getFollowings,getFollowers,followers,following ,postsLoading} = usePostStore();
    const { user,otherUser, userProfile,followUser , followLoading} = useAuthStore();
    const {Uid} = useParams();
    const [activeTab, setActiveTab] = useState(1);

    useEffect(() => {
        getUserPosts(Uid);
    }, [getUserPosts , Uid]);

    useEffect(() => {
        userProfile(Uid);
    },[Uid , userProfile])

    const tabs = [
      {id:1,icon:<BiSolidGrid size={40}/>},
      {id:2,icon:<RiVipCrown2Line  size={40}/>}
    ]



  return (
    <div className="container sm:mx-auto sm:px-4 pt-10 sm:max-w-xl rounded-lg shadow-sm ">
      <div className="sm:px-16 px-5 flex sm:gap-10 gap-4 items-center">
        {/* Profile Image */}
        <img
          src={otherUser?.profilePic || "/avatar.jpg"}
          alt="Profile"
          className="sm:w-24 sm:h-24 h-14 w-14 rounded-full object-cover"
        />

        {/* User Info */}
        <div>
          {/* User Name */}
          <h1 className="sm:text-3xl text-lg font-bold mb-5">{otherUser?.name}</h1>

          {/* Stats */}
          <div className="flex sm:gap-12 gap-6 mb-1">
            <div className="text-center">
              <p className="font-bold sm:text-2xl">{userPosts?.length}</p>
              <p className=" sm:text-lg">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold sm:text-2xl cursor-pointer" onClick={()=>{document.getElementById('my_modal_3').showModal(),getFollowers(Uid)}}>{otherUser?.followers?.length}</p>
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                <h3 className="font-bold text-3xl">Followers</h3>
                    <div className='overflow-y-scroll mt-4 scroll-container' style={{height: '310px'}}>

                    {followers.map((like) => (
                      <>
                      <div className='flex justify-between items-center'>

                      <div className="flex items-center gap-4 mt-10" key={like?.id}>
                        <img src={like?.profilePic} alt="" className="h-12 w-12 rounded-full" />
                        <div className="flex flex-col items-start">
                          <p className="font-bold">{like?.name}</p>
                        </div>
                      </div>

                      <button className='bg-primary text-primary-content px-4 py-3 rounded-2xl font-medium mt-10'>Follow</button>

                      </div>

                      <div className='border-b-2 border-base-300 mt-5'></div>
                      </>
                    ))}
                    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
              <p className=" sm:text-lg">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold sm:text-2xl cursor-pointer" onClick={()=>{document.getElementById('my_modal_4').showModal(),getFollowings(Uid)}}>{otherUser?.following?.length}</p>
              <dialog id="my_modal_4" className="modal">
                <div className="modal-box">
                <h3 className="font-bold text-3xl">Following</h3>
                    <div className='overflow-y-scroll mt-4 scroll-container' style={{height: '310px'}}>

                      {following.length === 0 && <h1 className='text-center mt-10 text-2xl'>0 following</h1>}

                    {following.map((like) => (
                      <>
                      <div className='flex justify-between items-center'>

                      <div className="flex items-center gap-4 mt-10" key={like?.id}>
                        <img src={like?.profilePic} alt="" className="h-12 w-12 rounded-full" />
                        <div className="flex flex-col items-start">
                          <p className="font-bold">{like?.name}</p>
                        </div>
                      </div>

                      <button className='bg-primary text-primary-content px-4 py-3 rounded-2xl font-medium mt-10'>Follow</button>

                      </div>

                      <div className='border-b-2 border-base-300 mt-5'></div>
                      </>
                    ))}
                    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
              <p className=" sm:text-lg">Following</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:px-20 px-5 mt-5">
        <p className="sm:text-lg text-base-content/70 font-medium">{otherUser?.bio}</p>
      </div>

      <div className="sm:px-16 px-5">
        {user?._id === Uid ? (
        <Link to={"/edit-profile"}>
        <button className="px-28 py-4 bg-primary mt-10 w-full text-primary-content rounded-2xl flex justify-center items-center gap-4">
          <FaUserEdit size={28} />
          <p className="font-bold text-lg">Edit Profile</p>
        </button>
        </Link>
        ) : (
<>
            <button className={`sm:px-28 sm:py-4 py-3 ${user?.following?.includes(otherUser?._id) ? "bg-base-300 text-base-content" : "bg-primary text-primary-content"} mt-10 w-full rounded-2xl flex justify-center items-center gap-4 transition-all duration-500`} onClick={() => followUser(otherUser?._id)}>
              {followLoading ? (
                <>
                <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                </>
              ) : (
                <>
                {user?.following?.includes(otherUser?._id) ? (
                  <SlUserUnfollow size={28} /> ) : ( <SlUserFollowing size={28} /> )}
              <p className="font-bold text-lg">{user?.following?.includes(Uid) ? "Unfollow" : "Follow"}</p>
                </>
              )
            }
            </button>

</>
        )}

      </div>

      <div className="border-b border-primary mt-5"></div>

<div className="flex justify-center px-3 mt-3">
      {tabs.map((tab) => (
        <div key={tab.id} className="cursor-pointer flex items-center">
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

        {activeTab === 1 && userPosts.length === 0 && (
          <motion.div
          initial={{ opacity: 0, x: 50}}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
                      <IoImagesOutline className="text-primary" size={80} />
                      <div className="absolute -inset-4 bg-primary/10 rounded-full blur-md"></div>
                    </div>
            <p className="mt-4 text-xl font-medium text-base-content">No posts yet</p>
            <p className="mt-1 text-sm text-base-content/50">This user hasn&apos;t shared anything yet.</p>
          </motion.div>
        )}

        {activeTab === 1 && userPosts.map((item) => (
          
          <motion.div
          initial={{ opacity: 0, x: 50}}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="mt-10 bg-gradient-to-br from-base-100 to-primary/15 p-5 rounded-2xl" key={item?._id}>
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item?.owner?.profilePic}
                  className="h-12 w-12 rounded-full"
                  alt=""
                />
                <p className="font-bold text-lg">{item?.owner?.name}</p>
              </div>
              <HiDotsHorizontal size={24} />
            </div>

<div className="flex justify-center">

            <img
              src={item?.image}
              alt=""
              className="mt-5 rounded-xl"
              style={{height:'420px', width:'470px'} }
              />
              </div>

            

            {/* Caption Section */}
            <div className="mt-4">
              <p className="text-lg">
                <span className="font-extrabold mr-1">
                  {item?.owner?.name}{" "}
                </span>
                {item?.caption}
              </p>
            </div>
          </motion.div>
        ))}

        {activeTab === 2 && <ExclusiveUserPostPage user={otherUser} currentUser={user} Uid={Uid}/>}
      </div>
    </div>
  );
};

export default UserPage;
