import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCompanionStore } from "../store/useCompanionStore";
import SubscriptionModal from "../components/SubscriptionModal";

const AiSubscriptionPage = () => {
  const { getPlan, plans } = useCompanionStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getPlan();
  }, [getPlan]);

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      className="bg-base-300 shadow-lg sm:rounded-3xl sm:my-20 container sm:mx-auto px-10 py-10 max-w-3xl relative overflow-hidden"
      initial={{ opacity: 0, y: 100 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >

<div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/20 blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-secondary/20 blur-xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="text-center mb-10">
        <h1 className="font-extrabold sm:text-5xl text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Subscribe</h1>
        <p className="text-gray-500 text-sm sm:text-md" >
          Select the plan that best suits your needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`card bg-base-100 shadow-xl ${
              plan.interval === "month" ? "border-2 border-primary" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-body">
              {plan.interval === "month" && (
                <div className="badge badge-primary absolute top-0 right-0 m-4">
                  Popular
                </div>
              )}
              <h2 className="card-title text-2xl font-bold">{plan.name}</h2>
              <p className="text-3xl font-bold my-4">
                ₹{plan.price}/{plan.interval}
              </p>
              <ul className="flex-1 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 mr-2 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="card-actions">
                <button 
                  className="btn btn-primary w-full rounded-2xl font-medium text-lg"
                  onClick={() => handleSubscribe(plan)}
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <SubscriptionModal 
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
      />
    </motion.div>
  );
};

export default AiSubscriptionPage; 