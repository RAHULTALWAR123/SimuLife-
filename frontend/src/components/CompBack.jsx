// import React from 'react'
import { motion } from "framer-motion"

// eslint-disable-next-line react/prop-types
const CompBack = ({setComponent , setNewPlayer , newPlayer}) => {
  return (
    <motion.div className="p-2 w-full"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >


<div className="text-center sm:flex flex-col gap-2 justify-center items-center mt-14">
          <label htmlFor="background" className="block text-lg font-medium text-base-content">
            Background
          </label>
          <textarea
            // eslint-disable-next-line react/prop-types
            value={newPlayer.background}
            onChange={(e) => setNewPlayer({ ...newPlayer, background: e.target.value })}
            className="textarea textarea-primary rounded-2xl w-full h-36 mt-1"
            placeholder="Born in Madeira, Portugal. Started career with Sporting CP.Won multiple Champions League titles, Ballon d'Or awards, and set numerous goal-scoring records.Known for incredible athleticism, dedication to fitness, and competitive spirit."
          ></textarea>
        </div>

        <p className="text-center mt-4 text-md font-medium text-primary">* Write a brief background for your companion, including their origin, career highlights and achievements.</p>

        <div className="flex justify-between mt-20">

    <button className="px-8 py-3 rounded-2xl bg-base-100 text-base-content font-medium text-lg" onClick={() => setComponent("1")}>prev</button>


    <button className="px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium text-lg" onClick={() => setComponent("3")}>next</button>

</div>




    </motion.div>
  )
}

export default CompBack
