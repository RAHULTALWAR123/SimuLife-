// import React from 'react'
import { motion } from "framer-motion"
import { Loader, Upload } from "lucide-react"

// eslint-disable-next-line react/prop-types
const CompImg = ({setComponent, newPlayer , handleImageChange ,compLoading}) => {
  return (
<motion.div className="p-2 w-full"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >

<div className="mt-10 flex flex-col items-center justify-center">

<img
            // eslint-disable-next-line react/prop-types
            src={newPlayer.img || "/avatar.jpg"}
            alt="Profile"
            className="w-52 h-52 rounded-full object-cover"
          />
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-base-100 py-2 px-3 border border-primary rounded-xl shadow-sm text-sm leading-4 font-medium text-base-content hover:bg-base-300 mt-5"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {/* eslint-disable-next-line react/prop-types*/}
          {newPlayer.img && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
          )}
        </div>

        <p className="text-center mt-4 text-md font-medium text-primary">* Upload an image of your companion</p>


        <div className="flex justify-between mt-20">

<button className="px-8 py-3 rounded-2xl bg-base-100 text-base-content font-medium text-lg" onClick={() => setComponent("4")}>prev</button>


<button
type="submit"
disabled={compLoading}
className="px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium text-lg">
    {compLoading ? (
            <>
            <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            </>
        ) : (
            "Generate"
        )}
    
    </button>

</div>





    {/* <button className="btn btn-primary" onClick={() => setComponent("5")}>next</button> */}
    </motion.div>
  )
}

export default CompImg
