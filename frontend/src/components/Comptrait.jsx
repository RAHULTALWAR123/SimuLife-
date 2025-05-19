// import React from 'react'
import { motion } from "framer-motion"
import { X } from "lucide-react"
// import { X } from "lucide-react"
// eslint-disable-next-line react/prop-types
const Comptrait = ({setComponent , handleRemoveTrait , handleAddTrait , traitInput , setTraitInput , newPlayer}) => {
  return (
<motion.div className="p-2 w-full"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >

<div className=" flex gap-3 justify-center items-center mt-14">
          <label htmlFor="traits" className="block text-lg font-medium text-base-content">
            Traits
          </label>
            <input
              type="text"
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
              placeholder="Confident and ambitious,Extremely competitive,Dedicated to fitness and excellence,Direct and passionate about football"
              className="input input-bordered input-primary rounded-2xl w-full"
            />
            <button
              type="button"
              onClick={handleAddTrait}
              className="btn btn-primary rounded-xl"
            >
              Add
            </button>

          </div>
          {/* eslint-disable-next-line react/prop-types */}
          {newPlayer.traits.length > 0 && (
            <ul className="mt-3 space-y-2">
          {/* eslint-disable-next-line react/prop-types */}
              {newPlayer.traits.map((trait, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-base-100 p-2 mt-6 rounded-xl "
                >
                  <span>{trait}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrait(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
           )}

        <p className="text-center mt-4 text-md font-medium text-primary">*enter the traits of the companion u want to create</p>


        <div className="flex justify-between mt-20">

<button className="px-8 py-3 rounded-2xl bg-base-100 text-base-content font-medium text-lg" onClick={() => setComponent("3")}>prev</button>


<button className="px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium text-lg" onClick={() => setComponent("5")}>next</button>

</div>


</motion.div>
  )
}

export default Comptrait
