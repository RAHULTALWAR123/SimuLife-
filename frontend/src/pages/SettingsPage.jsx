import { motion } from "framer-motion"
import { Palette } from "lucide-react"
import { FaRegBookmark, FaSearch, FaUserEdit } from "react-icons/fa"
import { FaCartShopping } from "react-icons/fa6"
import { IoLogOutOutline } from "react-icons/io5"

import { Link } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { useCompanionStore } from "../store/useCompanionStore"
// import Particles from "../components/Particles"

const SettingsPage = () => {
    const { logout} = useAuthStore();
      const {setSelectedCompanion,setSelectCompId} = useCompanionStore()
  
  return (
    <motion.div
  className="bg-base-300 shadow-2xl sm:rounded-3xl sm:my-20 container sm:mx-auto px-8 py-12 sm:max-w-2xl max-w-md relative overflow-hidden border border-base-200"
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
      <h1 className="font-extrabold sm:text-5xl text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Settings
      </h1>
      <p className="mt-2 text-base-content/70 text-sm sm:text-md">Customize your experience and preferences</p>
    </div>

    {/* Buttons grid */}
    <div className="grid grid-cols-1 gap-9 max-w-md mx-auto">

    <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-base-100 w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-1000 hover:bg-primary hover:text-primary-content border border-base-200 shadow-sm group"
        onClick={() => {logout(); setSelectedCompanion(null); setSelectCompId(null)}}
      >
        <div className="flex items-center justify-center gap-4">
          <span >
            <IoLogOutOutline size={24} />
          </span>
          <span>Logout</span>
        </div>
      </motion.button>


      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-base-100 w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-1000 hover:bg-primary hover:text-primary-content border border-base-200 shadow-sm group"
      >
        <Link to="/edit-profile" className="flex items-center justify-center gap-4">
          <span >
            <FaUserEdit size={24} />
          </span>
          <span>Edit Profile</span>
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
        <Link to="/themes" className="flex items-center justify-center gap-4">
          <span >
          <Palette size={24} />
          </span>
          <span>Customize Theme</span>
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
        <Link to="/downloads" className="flex items-center justify-center gap-4">
          <span >
            <FaRegBookmark  size={24} />
          </span>
          <span>Downloads</span>
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
        <Link to="/search-user" className="flex items-center justify-center gap-4">
          <span >
            <FaSearch size={24} />
          </span>
          <span>Search User</span>
        </Link>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.8 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-base-100 w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-1000 hover:bg-primary hover:text-primary-content border border-base-200 shadow-sm group"
      >
        <Link to="/subscribe-ai" className="flex items-center justify-center gap-4">
          <span >
            <FaCartShopping size={24} />
          </span>
          <span>Subscription</span>
        </Link>
      </motion.button>



    </div>
  </div>
</motion.div>
  )
}

export default SettingsPage
