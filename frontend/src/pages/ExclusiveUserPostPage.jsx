/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
import SubsModal from "../components/SubsModal";
import { usePostStore } from "../store/usePostStore";
import { HiDotsHorizontal } from "react-icons/hi";

import BlurText from "../components/BlurText";

const ExclusiveUserPostPage = ({ user, currentUser, Uid }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getUserPaidPost , paidPosts} = usePostStore();


  const handleSubscribe = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    getUserPaidPost(user?._id);
  }, [user?._id, getUserPaidPost]);



  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col justify-center items-center relative">

        {currentUser?._id !== Uid && !currentUser?.subscriptionsActive?.some(sub => sub.creator === Uid) && (
          <>
            <h1 className="text-4xl font-bold text-primary">Subscribers Only</h1>
            <p className="text-lg font-medium mt-5">
              Subscribe to {user?.name} to get access to exclusive content.
            </p>
            <button 
            onClick={() => handleSubscribe()}
            className="mt-10 px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium">
              {user?.postPrice === 0 ? 'No Subscription' : `Rs.${user?.postPrice}`}
            </button>
          </>
        )}

        {/* {user?.postPrice > 0 && user?._id === id && (
          <h1 className="text-4xl font-bold text-primary mt-10">Exclusive Content</h1>
        )} */}

        {currentUser?.subscriptionsActive?.some(sub => sub.creator === Uid) && (
          <>
          <BlurText
  text="Exclusive Content"
  delay={150}
  animateBy="words"
  direction="top"
  // onAnimationComplete={handleAnimationComplete}
  className="text-4xl font-bold text-primary"
/>
          {paidPosts.map((item) => (
                    <motion.div
                    initial={{ opacity: 0, x: -50}}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="mt-10 bg-gradient-to-br from-base-100 to-primary/15 shadow-lg rounded-2xl p-5" key={item?._id}>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={item?.owner?.profilePic}
                            className="h-12 w-12 rounded-full"
                            alt=""
                          />
                          <p className="font-bold text-lg">{item?.owner?.name}</p>
                        </div>
                        <HiDotsHorizontal size={24} />
                      </div>
          
          <div className="flex justify-center">

                      <img
                        src={item?.image}
                        alt=""
                        className="mt-5 rounded-xl"
                        style={{height:"420px" , width:"470px"}}
                        />
                        </div>
          

          
                      {/* Caption Section */}
                      <div className="mt-4">
                        <p className="text-lg">
                          <span className="font-extrabold mr-1">
                            {item?.owner?.name}{" "}
                          </span>
                          {item?.caption}
                        </p>
                      </div>
                    </motion.div>
                  ))}
          </>
        )}
        
      </div>

      <SubsModal 
        user={user}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </motion.div>
  );
};

export default ExclusiveUserPostPage;
