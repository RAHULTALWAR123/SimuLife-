// import React from 'react'
import { motion } from "framer-motion"

// eslint-disable-next-line react/prop-types
const CompIdentity = ({setComponent , setNewPlayer , newPlayer}) => {
  return (
    <motion.div className="p-2 w-full"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >

<div className="text-center sm:flex flex-col gap-2 justify-center items-center mt-14">
          <label htmlFor="identity" className="block text-lg font-medium text-base-content">
            Identity
          </label>
          <textarea
            // eslint-disable-next-line react/prop-types
            value={newPlayer.identity}
            onChange={(e) => setNewPlayer({ ...newPlayer, identity: e.target.value })}
            className="textarea textarea-primary rounded-2xl w-full h-36 mt-1"
            placeholder="I am Cristiano Ronaldo, one of the most successful footballers in history. I've played for clubs like Manchester United, Real Madrid, and Juventus. I'm known for my work ethic, goal-scoring ability, and signature 'SIUUU' celebration."
          ></textarea>
        </div>

        <p className="text-center mt-4 text-md font-medium text-primary">*Describe your companion’s identity in a few sentences—who they are, their profession and key attributes.</p>

        <div className="flex justify-between mt-20">

    <button className="px-8 py-3 rounded-2xl bg-base-100 text-base-content font-medium text-lg" onClick={() => setComponent("2")}>prev</button>


    <button className="px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium text-lg" onClick={() => setComponent("4")}>next</button>

</div>



    </motion.div>
  )
}

export default CompIdentity
