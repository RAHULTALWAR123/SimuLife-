// import React from 'react'

import { useEffect} from "react";
import { usePostStore } from "../store/usePostStore";
import { Link } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import Loading from "../components/Loading";

const BookmarkPage = () => {
    const {bookmarks , getbookmarkpost , postsLoading} = usePostStore();
    



    useEffect(() => {
        getbookmarkpost();
    }, [getbookmarkpost]);

    if(postsLoading) return <Loading/>

  return (
<div className="min-h-screen flex flex-col items-center pt-24 px-4">
  <div className="w-full max-w-xl">
    <h1 className="font-extrabold text-5xl text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
      Saved Posts
    </h1>

    {bookmarks.map((item) => (
      <div key={item?._id} className="mt-10 bg-base-300 rounded-2xl overflow-hidden border border-base-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
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

        {/* Caption */}
        <div className="mt-2 p-4">
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
    ))}
  </div>
</div>
  )
}

export default BookmarkPage
