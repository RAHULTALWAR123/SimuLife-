// import React from 'react'
import { motion } from "framer-motion"
// eslint-disable-next-line react/prop-types
const CompName = ({setComponent, setNewPlayer , newPlayer }) => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="p-2 w-full">


<div className="text-center flex gap-4 justify-center items-center mt-14">
          <label htmlFor="name" className="block text-lg font-medium text-base-content">
            Name
          </label>
          <input
            type="text"
            // eslint-disable-next-line react/prop-types
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            placeholder="Christiano Ronaldo"
            className="input input-bordered input-primary rounded-2xl w-full max-w-xs mt-1"
          />
        </div>

        <p className="text-center mt-4 text-md font-medium text-primary">*enter the name of the companion u want to create</p>

<div className="flex justify-between mt-20">

    <button className="px-8 py-3 rounded-2xl bg-base-100 text-base-content font-medium text-lg cursor-not-allowed" disabled>prev</button>


    <button className="px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium text-lg" onClick={() => setComponent("2")}>next</button>

</div>

    </motion.div>
  )
}

export default CompName
