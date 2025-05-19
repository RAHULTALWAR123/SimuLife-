import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlinePicture } from "react-icons/ai";
import { CgAddR } from "react-icons/cg";
import { usePostStore } from "../store/usePostStore";
import { Loader } from "lucide-react";

const CreatePage = () => {
  const { createPost, postsLoading } = usePostStore();
  const [newPlayer, setNewPlayer] = useState({
    image: "",
    caption: "",
    isPaidPost: false
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPlayer({ ...newPlayer, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(newPlayer);
    setNewPlayer({ image: "", caption: "", isPaidPost: false });
  };

  return (
    <motion.div
      className="bg-base-300 shadow-lg sm:rounded-2xl sm:my-10 container mx-auto px-6 py-8 max-w-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >

<div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary/10 blur-xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="text-center relative mb-8">
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></div>
        <h1 className="font-extrabold sm:text-5xl text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Create Post
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Share your moments with the community
        </p>

      </div>

      <div className="space-y-6">
        {/* Image Upload Area */}
        <div className="flex flex-col items-center">
          {newPlayer.image ? (
            <motion.div 
              className="relative group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={newPlayer.image}
                alt="Uploaded preview"
                className="w-full max-w-md h-96 object-cover rounded-xl shadow-sm"
              />
              <button 
                className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:scale-105 transition-transform"
                onClick={() => setNewPlayer({...newPlayer, image: ""})}
              >
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="w-full max-w-md h-96 rounded-xl bg-base-100  border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col justify-center items-center cursor-pointer hover:border-primary transition-colors"
              whileHover={{ scale: 1.01 }}
              onClick={() => document.getElementById('image').click()}
            >
              <AiOutlinePicture className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Click to upload image</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">or drag and drop</p>
            </motion.div>
          )}

          <input
            type="file"
            id="image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Exclusive Toggle */}
        <div className="flex justify-center">
          <div className="bg-base-100 rounded-2xl p-3 flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Exclusive Content</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={newPlayer.isPaidPost}
                  onChange={(e) => setNewPlayer({ ...newPlayer, isPaidPost: e.target.checked })}
                />
                <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${newPlayer.isPaidPost ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${newPlayer.isPaidPost ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Caption and Submit */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Caption
            </label>
            <textarea
              value={newPlayer.caption}
              onChange={(e) => setNewPlayer({ ...newPlayer, caption: e.target.value })}
              className="w-full px-4 py-3 bg-base-100 rounded-lg border-primary border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Share what's on your mind..."
              rows="3"
            />
          </div>

          <motion.button
            className={`w-full py-3 px-4 rounded-2xl font-medium flex items-center justify-center gap-2 ${newPlayer.image ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            onClick={handleSubmit}
            disabled={!newPlayer.image || postsLoading}
            whileHover={newPlayer.image ? { scale: 1.01 } : {}}
            whileTap={newPlayer.image ? { scale: 0.99 } : {}}
          >
            {postsLoading ? ( 
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <CgAddR className="w-5 h-5" />
                <span>Create Post</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePage;
