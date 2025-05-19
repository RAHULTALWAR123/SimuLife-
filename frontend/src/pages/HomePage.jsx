// import React from 'react'
import {motion} from "framer-motion"
import {FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import {SiTinder} from "react-icons/si"
import { BsEmojiSmileFill} from "react-icons/bs"
// import {CiBookmark} from "react-icons/ci"
import { usePostStore } from '../store/usePostStore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader } from 'lucide-react';
// import {CgArrowLongDown} from "react-icons/cg"
import {FaArrowDownLong} from "react-icons/fa6"
import {MdNavigateBefore, MdNavigateNext} from "react-icons/md"
import { useStoryStore } from "../store/useStoryStore";
import {formatDistanceToNow} from "date-fns"
import SpotlightCard from "../components/SpotlightCard";
import NewUserFeed from "../components/NewUserFeed";
import Loading from "../components/Loading";
// import {io} from "socket.io-client"

const HomePage = () => {
  // const socket = io("http://localhost:5000");
  const { getFeedPosts, feedPosts = [] , likeUnlike ,getlike , likes , likesLoading , getComments ,comments ,sendComment , getFollowings , following ,bookmarkpost,postsLoading} = usePostStore();
  const { user , getSuggested , suggested } = useAuthStore();
  const {getStories , stories} = useStoryStore();



  const [commentTexts, setCommentTexts] = useState({});

  const [currPage, setCurrPage] = useState(0);
  

  // const images = [
  //   { id: 1, src: "/test.jpeg" },
  //   { id: 2, src: "/test2.jpg" },
  // ]

  const curr = stories.slice(currPage, currPage + 1);

  const handleNext = () => {
    if (currPage < stories.length - 1) {
      setCurrPage(currPage + 1);
    }
  }

  const handlePrev = () => {
    if (currPage > 0) {
      setCurrPage(currPage - 1);
    }
  }


  useEffect(() => {
    getFeedPosts();
  }, [getFeedPosts]);

  useEffect(() => {
    getSuggested();
  },[getSuggested]);

  useEffect(() => {
    getFollowings(user?._id);
  },[getFollowings,user?._id]);


  // const handleComment = (id) => {
  //   sendComment(id,text);
  //   setText('');
  // }

  const handleCommentTextChange = (postId, text) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: text
    }));
  };


  const handleCommentSubmit = async (postId) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;

    await sendComment(postId, text);
    // Clear only the specific post's comment text
    setCommentTexts(prev => ({
      ...prev,
      [postId]: ''
    }));
    // Refresh comments for this post
    getComments(postId);
  };

  const getCommentModalId = (postId) => `comment_modal_${postId}`;
  const getLikeModalId = (postId) => `like_modal_${postId}`;
  const storyModalId = (userId) => `story_modal_${userId}`;


  if(postsLoading) return <Loading/>


  return (
    <>
      {feedPosts.length === 0 && 
      <div className="container mx-auto px-2 pt-12 max-w-6xl">
      <NewUserFeed/>
      </div>
      }
    
    <div className="container mx-auto px-2 pt-10 max-w-xl">
      
      {feedPosts.length > 0 && (
        <>
        
      <div className="overflow-x-auto scroll-container">
        <ul className="flex flex-row gap-4 w-max">
        <li  className="flex-none rounded-full text-4xl">
        <button 
  onClick={() => {
    document.getElementById(storyModalId(user?._id)).showModal();
    getStories(user?._id);
  }}
  className="relative"
>
  <div className={`relative w-20 h-20 rounded-full ${
    user?.story?.length > 0 
      ? "p-[2px] bg-gradient-to-r from-primary to-secondary" 
      : "p-[2px] bg-base-content/40"
  }`}>
    <img 
      src={user?.profilePic || "/avatar.jpg"} 
      alt="" 
      className="w-full h-full rounded-full object-cover p-[2px] bg-base-300" 
    />
    
      <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 border-2 border-base-100">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-white" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
  </div>
</button>

              <dialog id={storyModalId(user?._id)} className="modal">
                <div className="modal-box sm:w-5/12 bg-base-300 p-0 h-full rounded-3xl">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-red-500 text-lg">✕</button>
                </form>
                <div className='flex justify-center items-center absolute '>
                <img src={user?.profilePic || "/avatar.jpg"} alt="" className='w-12 h-12 rounded-full absolute top-2 left-2' />
                <p className="py-4 text-base-content text-lg font-medium relative left-16">{user?.name}</p>
                {curr.map((image) => (
                  <p className="py-4 text-base-content text-sm relative left-16 ml-2" key={image?._id}>{formatDistanceToNow(new Date(image?.createdAt))}</p>
                ))}
                </div>
                {curr.map((image) => (
                  <motion.img
                  initial={{ opacity: 0 , x: 0 }}
                  animate={{ opacity: 1 , y: 0 }}
                  transition={{ duration: 0.8 }}
                  src={image?.imageUrl} alt="" className='w-full h-full rounded-2xl mx-auto' key={image?._id} />
                ))}

                {stories.length === 0 &&(
                  <div className='flex justify-center items-center h-full'>
                  <p className='text-lg font-semibold text-base-content'>No stories to show</p>
                  </div>
                )}

                <button className='text-primary-content absolute bottom-2 right-2 btn btn-sm btn-circle btn-primary' onClick={handleNext} disabled={stories.length <= 1}>
                <MdNavigateNext size={30}  />
                </button>
                <button className='text-primary-content absolute bottom-2 left-2 btn btn-sm btn-circle btn-primary' onClick={handlePrev} disabled={stories.length <= 1}>
                <MdNavigateBefore size={30} />
                </button>
                </div>
              </dialog>



              <p className='text-sm text-center mt-2 text-base-content'>{user?.name}</p>
            </li>
          {following.map((i) => (
            <li key={i?._id} className="flex-none rounded-full">
              <button onClick={()=>{document.getElementById(storyModalId(i?._id)).showModal(),getStories(i?._id)}}>
              <div className={`relative w-20 h-20 rounded-full ${i?.story?.length > 0 ? "p-[2px] bg-gradient-to-r from-primary to-secondary" : "p-[2px] bg-base-content/40"}`}>
  <img 
    src={i?.profilePic || "/avatar.jpg"} 
    alt="" 
    className="w-full h-full rounded-full object-cover p-[2px]" 
  />
</div>
              </button>

              <dialog id={storyModalId(i?._id)} className="modal">
                <div className="modal-box sm:w-5/12 bg-base-300 p-0 h-screen rounded-3xl">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-red-500 text-lg">✕</button>
                </form>
                <div className='flex justify-center items-center absolute '>
                <img src={i?.profilePic} alt="" className='w-12 h-12 rounded-full absolute top-2 left-2' />
                <p className="py-4 text-base-content text-lg font-medium relative left-16">{i?.name}</p>
                {curr.map((image) => (
                  <p className="py-4 text-base-content text-sm relative left-16 ml-2" key={image?._id}>{formatDistanceToNow(new Date(image?.createdAt))}</p>
                ))}
                </div>
                {curr.map((image) => (
                  <motion.img
                  initial={{ opacity: 0 , x: 0 }}
                  animate={{ opacity: 1 , y: 0 }}
                  transition={{ duration: 0.8 }}
                  src={image?.imageUrl} alt="" className='w-full h-full rounded-2xl mx-auto' key={image?._id} />
                ))}

                {stories.length === 0 &&(
                  <div className='flex justify-center items-center h-full'>
                  <p className='text-lg font-semibold text-base-content'>No stories to show</p>
                  </div>
                )}

                <button className='text-primary-content absolute bottom-2 right-2 btn btn-sm btn-circle btn-primary' onClick={handleNext} disabled={stories.length <= 1}>
                <MdNavigateNext size={30}  />
                </button>
                <button className='text-primary-content absolute bottom-2 left-2 btn btn-sm btn-circle btn-primary' onClick={handlePrev} disabled={stories.length <= 1}>
                <MdNavigateBefore size={30} />
                </button>
                </div>
              </dialog>


              <p className='text-sm text-center mt-2'>{i.name}</p>
            </li>
          ))}
        </ul>
      </div>


      <div className="hidden sm:block w-1/4 absolute top-3 right-2 ">
      <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.45)">
      <SiTinder className="text-3xl text-base-content" />
      <h1 className="text-3xl font-semibold mt-3">
        <span className="text-base-content">Discover Love</span>
      </h1>
      <p className="mt-2 text-base-content font-light text-md ">
      Meet new people, build connections, and swipe to discover love, friendship, or fun.
      </p>
      <Link to={"/discover"}>
      <button className="py-3 px-6 rounded-2xl bg-primary text-primary-content font-medium mt-5">
        Let&apos;s Begin
      </button>
      </Link> 
      </SpotlightCard>
      </div>

      <div className="hidden sm:block w-1/4 absolute top-3 left-2">
      <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.45)">
      <BsEmojiSmileFill className="text-3xl text-base-content" />
      <h1 className="text-3xl font-semibold mt-3">
        <span className="text-base-content">Share Your Story</span>
      </h1>
      <p className="mt-2 text-base-content font-light text-md ">
      Express yourself and share your story, your vibe, and what truly matters to you.
      </p>
      <Link to={"/express-yourself"}>
      <button className="py-3 px-6 rounded-2xl bg-secondary text-secondary-content font-medium mt-5">
        Share
      </button>
      </Link>
      </SpotlightCard>
      </div>

      </>
      )}


      

{feedPosts.map((item) => (
  <div key={item?._id}>

    {/* === POST UI START === */}
<div className="mt-10 bg-base-300 rounded-2xl overflow-hidden border border-base-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
  {/* Header */}
  <div className="flex justify-between items-center p-4">
    <Link to={`/userProfile/${item?.owner?._id}`} className="flex items-center gap-3 group">
      <div className="relative">
        <img 
          src={item?.owner?.profilePic} 
          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-base-100"
          alt={item?.owner?.name}
        />
        <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-200"></span>
      </div>
      <p className="font-semibold text-base group-hover:text-primary transition-colors duration-200">
        {item?.owner?.name}
      </p>
    </Link>
    <button className="p-1 rounded-full hover:bg-base-300 transition-colors duration-200">
      <HiDotsHorizontal size={20} className="text-base-content/80" />
    </button>
  </div>

  {/* Image */}
  <div className="relative aspect-square bg-base-200">
    <img 
      src={item?.image} 
      alt="" 
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </div>

  {/* Actions */}
  <div className="py-4 px-2">
    <div className="flex justify-between items-center">
      <div className="flex gap-5">
        <button 
          onClick={() => likeUnlike(item?._id)}
          className=" rounded-full hover:bg-base-300 transition-colors duration-200 group"
        >
          <FaRegHeart 
            size={24} 
            className={`group-hover:text-primary ${item?.likedBy?.includes(user?._id) ? 'text-primary fill-primary' : 'text-base-content/80'}`} 
          />
        </button>
        
        <button 
          onClick={() => {
            document.getElementById(getCommentModalId(item?._id)).showModal();
            getComments(item?._id);
          }}
          className="rounded-full hover:bg-base-300 transition-colors duration-200 group"
        >
          <FaRegComment 
            size={24} 
            className="text-base-content/80 group-hover:text-primary" 
          />
        </button>
        
        <button className=" rounded-full hover:bg-base-300 transition-colors duration-200 group"
        onClick={() => {bookmarkpost(item?._id)}}
        >
          <FaRegBookmark size={24} className={` group-hover:text-primary ${user?.saved?.includes(item?._id) ? 'text-primary fill-primary' : 'text-base-content/80'}`} />
        </button>
      </div>
      
     
    </div>

    {/* Likes and comments count */}
    <div className="flex gap-4 mt-2 text-sm">
      <button 
        onClick={() => {
          document.getElementById(getLikeModalId(item?._id)).showModal();
          getlike(item?._id);
        }}
        className="font-medium hover:underline"
      >
        {item?.likedBy?.length} likes
      </button>
      <button 
        onClick={() => {
          document.getElementById(getCommentModalId(item?._id)).showModal();
          getComments(item?._id);
        }}
        className="font-medium hover:underline"
      >
        {item?.comments?.length} comments
      </button>
    </div>

    {/* Caption */}
    <div className="mt-2">
      <p className="text-base">
        <Link 
          to={`/userProfile/${item?.owner?._id}`}
          className="font-bold hover:underline mr-2"
        >
          {item?.owner?.name}
        </Link>
        {item?.caption}
      </p>
    </div>

    
  </div>
</div>
{/* === POST UI END === */}

    {/* === LIKES DIALOG === */}
    <dialog id={getLikeModalId(item?._id)} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-3xl">Likes</h3>
        <div className='overflow-y-scroll mt-4 scroll-container' style={{height: '310px'}}>

          {likesLoading ? (
            <div className='flex justify-center items-center'>
              <Loader className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : (
            likes.map((like) => (
              <div key={like?.id}>
                <div className='flex justify-between items-center'>
                  <div className="flex items-center gap-4 mt-10">
                    <img src={like?.profilePic} alt="" className="h-12 w-12 rounded-full" />
                    <div className="flex flex-col items-start">
                      <p className="font-semibold text-lg">{like?.name}</p>
                    </div>
                  </div>
                  <button className='bg-primary text-primary-content px-4 py-3 rounded-2xl font-medium mt-10'>Follow</button>
                </div>
                <div className='border-b-2 border-base-300 mt-5'></div>
              </div>
            ))
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    {/* === COMMENTS DIALOG === */}
    <dialog id={getCommentModalId(item?._id)} className="modal">
      <div className="modal-box bg-base-100 rounded-3xl">
        <h3 className="font-bold text-3xl">Comments</h3>

        <div className='flex items-center gap-3'>
          <input 
            type="text" 
            placeholder="Type here" 
            value={commentTexts[item?._id] || ''} 
            onChange={(e) => handleCommentTextChange(item?._id, e.target.value)}  
            className="input input-bordered w-full max-w-s mt-5 rounded-2xl" 
          />
          <button 
            className="btn btn-primary rounded-full h-8 mt-5" 
            onClick={() => handleCommentSubmit(item?._id)}
          >
            <FaArrowDownLong size={20} />
          </button>
        </div>

        <div className='overflow-y-scroll mt-4 scroll-container' style={{height: '310px'}}>
          {comments.length === 0 && (
            <p className='text-center mt-10 text-lg'>No comments yet</p>
          )}
          {comments.map((comment) => (
            <div key={comment?.userId}>
              <div className='flex justify-between items-center'>
                <div className="flex items-center gap-4 mt-10">
                  <img src={comment?.userProfilePic || "/avatar.jpg"}  alt="" className="h-12 w-12 rounded-full" />
                  <div className="flex flex-col items-start">
                    <p className="font-semibold text-lg">{comment?.name}</p>
                    <p>{comment?.text}</p>
                  </div>
                </div>
                <div>
                  <FaRegHeart size={20} className="mt-10" />
                  <p className='mt-2'>3</p>
                </div>
              </div>
              <div className='border-b-2 border-base-300 mt-5'></div>
            </div>
          ))}
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="bg-primary text-primary-content px-4 py-3 rounded-2xl font-medium">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
))}


<div className="border-b-2 border-base-300 mt-5 mb-5"></div>
    <h1 className="font-bold text-2xl">
      Suggested for you 
    </h1>
<div className="overflow-x-auto scroll-container mb-5">
        <ul className="flex flex-row gap-4 w-full">

{(suggested.map((item) => (
  
  <li className="flex-none" key={item?._id}>
  <div className="group relative mt-5 h-auto w-72 rounded-2xl bg-base-300 p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    {/* Profile Header */}
    <Link className="flex flex-col items-center">
      <div className="relative">
        <img 
          src={item?.profilePic || "/avatar.jpg"} 
          alt={item?.name} 
          className="w-24 h-24 rounded-full object-cover border-4 border-primary/10 transition-all duration-300 group-hover:border-primary/30"
        />
        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-content rounded-full px-2 py-1 text-xs font-bold">
          {item?.followers?.length || 0} followers
        </div>
      </div>
      <h3 className="mt-3 text-xl font-bold text-center">{item?.name}</h3>
      <p className="text-sm text-base-content/70">{item?.bio || "No bio yet"}</p>
    </Link>

    {/* Followers Preview */}
    <div className="mt-4 flex items-center justify-center">
      {item?.followers?.length > 0 ? (
        <div className="flex items-center">
          <div className="flex -space-x-3">
            {item.followers.slice(0, 3).map((follower, index) => (
              <img
                key={follower._id}
                src={follower.profilePic}
                alt={follower.name}
                className="h-8 w-8 rounded-full border-2 border-base-100 object-cover"
                style={{ zIndex: 3 - index }}
              />
            ))}
          </div>
          <div className="ml-3 text-sm text-base-content/80">
            Followed by {item.followers[0]?.name}
            {item.followers.length > 1 && ` + ${item.followers.length - 1} others`}
          </div>
        </div>
      ) : (
        <p className="text-sm text-base-content/50">No followers yet</p>
      )}
    </div>

    {/* Follow Button */}
      <Link to={`/userProfile/${item?._id}`}>
    <div className="mt-6 flex justify-center">
      <button className="btn btn-primary w-full max-w-xs rounded-xl px-6 py-2 font-medium transition-all hover:scale-[1.02]">
        View
      </button>
    </div>
      </Link>

    {/* Hover effect overlay */}
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
  </div>
</li>
)))}

            
        </ul>
      </div>

    </div>
    </>
  );
};

export default HomePage;

