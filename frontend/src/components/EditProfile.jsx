// import React from 'react'
// import e from "express";
import { motion } from "framer-motion" 
import { CheckCircle, Loader, Upload } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const EditProfile = () => {
    // const compLoading = false;

    const { user , editP , userLoading } = useAuthStore();
  
    const [newPlayer, setNewPlayer] = useState({
      profilePic: "",
      name: "",
      username: "",
      password: "",
      email: "",
      bio: "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(newPlayer);

      editP(newPlayer);
    };


  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setNewPlayer({ ...newPlayer, profilePic: reader.result });
        };
  
        reader.readAsDataURL(file); // Convert to base64
      }
    };
  
    return (
      <motion.div
        className="bg-base-100 shadow-xl sm:rounded-3xl sm:my-8 container mx-auto px-4 sm:px-8 py-8 max-w-2xl relative overflow-hidden border border-base-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >

<div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-xl"></div>
<div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl"></div>

        <div className="text-center mb-8 relative z-10">
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full mb-1"></div>
          <h1 className="font-extrabold sm:text-5xl text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-center">Edit Profile</h1>
          <p className="mt-2 text-base-content/70 text-center text-sm sm:text-md">Update your personal information</p>
        </div>
    
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary/10 group-hover:border-primary/30 transition-all duration-300">
              <img
                src={newPlayer.profilePic || user?.profilePic || "/avatar.jpg"}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <label
              htmlFor="image"
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-content rounded-full p-2 shadow-lg cursor-pointer hover:bg-primary-focus transition-all"
              title="Change profile picture"
            >
              <Upload className="h-5 w-5" />
              <span className="sr-only">Change profile picture</span>
            </label>
            <input
              type="file"
              id="image"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          
          {newPlayer.profilePic && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle className="h-4 w-4" />
              <span>Image uploaded successfully</span>
            </div>
          )}
        </div>
    
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                id="name"
                type="text"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                placeholder={user?.name || "Enter your name"}
                className="input input-bordered w-full focus:input-primary focus:ring-1"
              />
            </div>
    
            {/* Username Field */}
            <div className="form-control">
              <label htmlFor="username" className="label">
                <span className="label-text">Username</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">@</span>
                <input
                  id="username"
                  type="text"
                  value={newPlayer.username}
                  onChange={(e) => setNewPlayer({ ...newPlayer, username: e.target.value })}
                  placeholder={user?.username || "username"}
                  className="input input-bordered w-full pl-8 focus:input-primary focus:ring-1"
                />
              </div>
            </div>
    
            {/* Email Field */}
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                id="email"
                type="email"
                value={newPlayer.email}
                onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                placeholder={user?.email || "your.email@example.com"}
                className="input input-bordered w-full focus:input-primary focus:ring-1"
              />
            </div>
    
            {/* Password Field */}
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={newPlayer.password}
                  onChange={(e) => setNewPlayer({ ...newPlayer, password: e.target.value })}
                  placeholder="••••••••"
                  className="input input-bordered w-full focus:input-primary focus:ring-1"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-base-content/50">
                  Leave blank to keep current
                </span>
              </div>
            </div>
    
            {/* Bio Field */}
            <div className="form-control">
              <label htmlFor="bio" className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                id="bio"
                value={newPlayer.bio}
                onChange={(e) => setNewPlayer({ ...newPlayer, bio: e.target.value })}
                placeholder={user?.bio || "Tell us about yourself..."}
                rows={3}
                className="textarea textarea-bordered w-full focus:textarea-primary focus:ring-1"
              />
            </div>
          </div>
    
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto sm:px-12 rounded-xl text-lg font-semibold transition-all hover:scale-[1.02]"
              disabled={userLoading}
            >
              {userLoading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    );
  };
  
  export default EditProfile;
  