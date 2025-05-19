import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlinePicture } from "react-icons/ai";
import { CgAddR } from "react-icons/cg";
import { Loader } from "lucide-react";
import { useStoryStore } from "../store/useStoryStore";

const CreateStory = () => {
  const { addStory, storiesLoading } = useStoryStore();
  const [newPlayer, setNewPlayer] = useState({
    imageUrl: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPlayer({ ...newPlayer, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addStory(newPlayer);
  };

  return (
    <motion.div
      className="bg-base-300 shadow-lg sm:rounded-2xl sm:my-10 container mx-auto px-6 py-8 max-w-md relative overflow-hidden h-[calc(100vh-68px)] sm:h-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >

<div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary/10 blur-xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="text-center relative mb-8">
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></div>
        <h1 className="font-extrabold sm:text-5xl text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Add Story
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Share a moment that disappears in 24 hours
        </p>
      </div>

      <div className="space-y-6">
        {/* Image Upload Area */}
        <div className="flex flex-col items-center">
          {newPlayer.imageUrl ? (
            <motion.div 
              className="relative group w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={newPlayer.imageUrl}
                alt="Story preview"
                className="w-full aspect-[9/16] object-cover rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              />
              <button 
                className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:scale-105 transition-transform"
                onClick={() => setNewPlayer({...newPlayer, imageUrl: ""})}
              >
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="w-full aspect-square rounded-xl bg-base-100 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col justify-center items-center cursor-pointer hover:border-primary transition-colors"
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

        {/* Submit Button */}
        <motion.button
          className={`w-full py-3 px-4 rounded-2xl font-medium flex items-center justify-center gap-2 ${newPlayer.imageUrl ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          onClick={handleSubmit}
          disabled={!newPlayer.imageUrl || storiesLoading}
          whileHover={newPlayer.imageUrl ? { scale: 1.01 } : {}}
          whileTap={newPlayer.imageUrl ? { scale: 0.99 } : {}}
        >
          {storiesLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <CgAddR className="w-5 h-5" />
              <span>Add Story</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CreateStory;