/* eslint-disable react/prop-types */
// import React from 'react'
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const TrialModal = ({setIsOpen}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
    <motion.div
      className="bg-base-100 shadow-lg rounded-3xl p-8 max-w-sm w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Free Trial Expired
        </h1>
        <p className="mt-4 text-gray-500 text-lg">
          Your free trial has ended. Upgrade to a premium plan to continue
          using all features.
        </p>
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setIsOpen(false)}
          className="px-6 py-2 rounded-xl bg-base-300 text-base-content font-medium hover:bg-base-200 transition"
        >
          Cancel
        </button>
        <Link to={"/subscribe-ai"}>
        <button className="px-6 py-2 rounded-xl bg-primary text-primary-content font-medium hover:bg-primary-focus transition">
          Confirm
        </button>
        </Link>
      </div>
    </motion.div>
  </div>
  )
}

export default TrialModal
