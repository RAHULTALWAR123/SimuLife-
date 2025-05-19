import { motion } from "framer-motion"
import { BsEmojiSmileFill } from "react-icons/bs"
import { MdAddBox, MdHistoryToggleOff } from "react-icons/md"
import { SiOpenai, SiTinder } from "react-icons/si"
import { Link } from "react-router-dom"
// import Particles from "../components/Particles"

const CreateOp = () => {
  
  return (
    <motion.div
  className="bg-base-300 shadow-2xl sm:rounded-3xl sm:my-20 container sm:mx-auto px-8 py-12 sm:max-w-2xl max-w-md relative h-[calc(100vh-68px)] overflow-hidden border border-base-200"
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  {/* Decorative elements */}
  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-xl"></div>
  <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl"></div>

  {/* Content container */}
  <div className="relative z-10">
    {/* Header with subtle decoration */}
    <div className="text-center mb-12 relative">
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></div>
      <h1 className="font-extrabold text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Create
      </h1>
      <p className="mt-2 text-base-content/70">Choose what you&apos;d like to create</p>
    </div>

    {/* Buttons grid */}
    <div className="grid grid-cols-1 gap-5 max-w-md mx-auto">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-base-100 w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-1000 hover:bg-primary hover:text-primary-content border border-base-200 shadow-sm group"
      >
        <Link to="/create-post" className="flex items-center justify-center gap-4">
          <span >
            <MdAddBox size={24} />
          </span>
          <span>New Post</span>
        </Link>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-base-100 w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-1000 hover:bg-primary hover:text-primary-content border border-base-200 shadow-sm group"
      >
        <Link to="/create-comp" className="flex items-center justify-center gap-4">
          <span >
            <SiOpenai size={24} />
          </span>
          <span>New Companion</span>
        </Link>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-base-100 w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-1000 hover:bg-primary hover:text-primary-content border border-base-200 shadow-sm group"
      >
        <Link to="/create-story" className="flex items-center justify-center gap-4">
          <span >
            <MdHistoryToggleOff size={24} />
          </span>
          <span>New Story</span>
        </Link>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.0 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-base-100 w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-1000 hover:bg-primary hover:text-primary-content border border-base-200 shadow-sm group"
      >
        <Link to="/express-yourself" className="flex items-center justify-center gap-4">
          <span >
            <BsEmojiSmileFill size={24} />
          </span>
          <span>Share Your Feelings</span>
        </Link>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-base-100 w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-1000 hover:bg-primary hover:text-primary-content border border-base-200 shadow-sm group"
      >
        <Link to="/discover" className="flex items-center justify-center gap-4">
          <span >
            <SiTinder size={24} />
          </span>
          <span>Discover Love</span>
        </Link>
      </motion.button>
    </div>
  </div>
</motion.div>


  )
}

export default CreateOp
