/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { HiDotsHorizontal } from "react-icons/hi";

import BlurText from "../components/BlurText";
import { Link } from "react-router-dom";
// import SubsModal from "../components/SubsModal";

const ExclusivePostPage = ({ user, id }) => {
  const [postPrice, setPostPrice] = useState('');
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { enterPostPrice } = useAuthStore();
  const { getUserPaidPost , paidPosts} = usePostStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(postPrice);

    try {
      await enterPostPrice(postPrice, id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserPaidPost(id);
  }, [id, getUserPaidPost]);





  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col justify-center items-center relative">

        {user?._id === id && user?.postPrice === 0 && (
          <>
            <h1 className="sm:text-4xl text-3xl font-bold text-primary">Set Up Paid Post</h1>
            <p className="sm:text-lg text-sm font-medium mt-5 text-center px-2">
              You can set up and manage your exclusive paid content here.
            </p>
            <button
              onClick={() => document.getElementById('paidModal').showModal()}
              className="mt-10 px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium"
            >
              Setup Now
            </button>
            <dialog id="paidModal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-2xl text-primary mb-4">Set Monthly Subscription Price</h3>
                <p className="text-gray-600 mb-6">Enter the price you want to charge for access to your paid content.</p>
                <form className="flex flex-col gap-4">
                  <label htmlFor="subscriptionPrice" className="text-lg font-medium">
                    Monthly Price (₹)
                  </label>
                  <input
                    type="number"
                    id="subscriptionPrice"
                    name="subscriptionPrice"
                    value={postPrice}
                    onChange={(e) => setPostPrice(e.target.value)}
                    className="input input-bordered w-full px-4 py-2 rounded-md border-gray-300 focus:border-primary focus:outline-none"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-primary-content rounded-xl font-medium hover:bg-primary-focus"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-base-300 text-base-content rounded-xl font-medium hover:bg-base-200"
                      onClick={() => document.getElementById("paidModal").close()}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="hidden">close</button>
              </form>
            </dialog>
          </>
        )}


        {user?.postPrice > 0 && user?._id === id && (
          <>
  <BlurText
  text="Exclusive Content"
  delay={150}
  animateBy="words"
  direction="top"
  // onAnimationComplete={handleAnimationComplete}
  className="text-4xl font-bold text-primary mb-5"
/>
                    {paidPosts.map((item) => (
                              <motion.div
                              key={item._id}
                              initial={{ opacity: 0, x: -50}}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 1 }}
                              className="bg-base-300 rounded-2xl overflow-hidden shadow-sm border border-base-300/50 hover:shadow-md transition-shadow mx-2 mb-5"
                            >
                              {/* Post Header */}
                              <div className="flex justify-between items-center p-4">
                                <Link 
                                  to={`/userProfile/${item.owner._id}`}
                                  className="flex items-center gap-3 group"
                                >
                                  <div className="relative">
                                    <img
                                      src={item.owner.profilePic || "/avatar.jpg"}
                                      className="h-10 w-10 rounded-full object-cover border-2 border-primary/10 group-hover:border-primary/30 transition-all"
                                      alt={item.owner.name}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold group-hover:text-primary transition-colors">
                                      {item.owner.name}
                                    </p>
                                   
                                  </div>
                                </Link>
                                <button className="p-1 rounded-full hover:bg-base-200 transition-colors">
                                  <HiDotsHorizontal size={20} className="text-base-content/70" />
                                </button>
                              </div>
                  
                              {/* Post Image */}
                              <div className="relative aspect-square bg-base-200">
                                <img
                                  src={item.image}
                                  alt={item.caption || "Post image"}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-base-100/30 to-transparent pointer-events-none"></div>
                              </div>
                  
                              {/* Post Actions */}
                              <div className="p-4">
                                
                  
                                {/* Caption */}
                                <div className="text-base">
                                  <Link 
                                    to={`/userProfile/${item.owner._id}`}
                                    className="font-semibold hover:text-primary transition-colors mr-1"
                                  >
                                    {item.owner.name}
                                  </Link>
                                  <span>{item.caption}</span>
                                </div>
                  
                  
                              </div>
                            </motion.div>
                            ))}
                    </>
        )}
      </div>


    </motion.div>
  );
};

export default ExclusivePostPage;
