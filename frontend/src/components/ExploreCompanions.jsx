// import React from 'react'
import { motion } from "framer-motion"
import { useCompanionStore } from "../store/useCompanionStore"
import { useEffect } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { MdAddBox, MdFileDownloadDone } from "react-icons/md"
// import { all } from "axios"

const ExploreCompanions = () => {

    const {getAll, companions,buy} = useCompanionStore()

    const {user} = useAuthStore()

    // const isOwner = owners.includes(user?._id)
    // console.log(owners);
    
    useEffect(() => {
        getAll()
    }, [getAll])


  return (
    <motion.div
  className="bg-base-300 shadow-2xl sm:rounded-3xl sm:my-20 container sm:mx-auto px-8 py-10 max-w-4xl relative overflow-hidden border border-base-200"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
<div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-xl"></div>
<div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl"></div>
  <div>

    <div className="relative z-10">
  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full mb-1"></div>
    <h1 className="text-center font-extrabold sm:text-5xl text-4xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
      Companions
    </h1>
    <p className="text-center text-sm sm:text-md opacity-80 mb-10">Discover and deploy your AI partners</p>
    </div>

    <div className="sm:grid sm:grid-cols-2 flex flex-col gap-8 mt-10">
      {companions?.map((companion) => (
        <motion.div 
          className="w-full bg-base-100 rounded-2xl flex flex-col items-center gap-5 p-8 border border-primary hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
          key={companion?._id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            <img 
              src={companion?.img} 
              alt={companion?.name} 
              className="w-36 h-36 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
            />
            {companion?.owner?.includes(user?._id) && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1.5">
                <MdFileDownloadDone size={16} />
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-center">{companion?.name}</h1>

          <p className="text-center text-sm opacity-80">{companion?.identity}</p>
          
          <motion.button 
            className={`${
              companion?.owner?.includes(user?._id) 
                ? "bg-gradient-to-tr from-primary to-secondary hover:bg-primary/90 hover:to-secondary/90 text-primary-content" 
                : "bg-gradient-to-r from-base-100 to-base-300 hover:from-primary/90 hover:to-secondary/90 text-white"
            } font-bold text-lg rounded-xl px-8 py-3 w-full transition-all duration-200 shadow-md`} 
            onClick={() => buy(companion?._id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {companion?.owner?.includes(user?._id) ? (
              <div className="flex items-center justify-center gap-2">
                <MdFileDownloadDone size={20} />
                Deployed
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <MdAddBox size={20}/> 
                Deploy
              </div>
            )}
          </motion.button>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>
  )
}

export default ExploreCompanions
