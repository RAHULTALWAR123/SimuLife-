// import React from 'react'
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { useCompanionStore } from "../store/useCompanionStore";


const PurchasesPage = () => {
    
    
    
    const { user , getUserPlans , plan} = useAuthStore();
    const {credits} = useCompanionStore();
    
    const creditsUsed = credits || user.credits;
    const totalCredits = plan?.interval === "week" ? 50 : 500;
    const percentageUsed = (creditsUsed / totalCredits) * 100;

    // Format subscription end date
  const formattedDate = user?.subscriptionEnd
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(user.subscriptionEnd)
      )
    : "N/A";

    const status = user?.subscriptionEnd ? 
  (new Date(user.subscriptionEnd) < new Date() ? "Expired" : "Active") : 
  "Inactive";

    useEffect(() => {
    getUserPlans();
    }, [getUserPlans]);


  return (
    <motion.div
  className="bg-base-300 shadow-xl sm:rounded-3xl sm:my-10 container mx-auto px-8 py-8 max-w-3xl border border-base-200 relative overflow-hidden"
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  {/* Decorative elements - now properly contained */}
  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary/10 blur-xl transform -translate-x-1/2 translate-y-1/2"></div>

  {/* Page Header with decorative elements */}
  <div className="text-center relative pb-2">
    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></div>
    <h1 className="font-extrabold text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
      Purchases
      </h1>
    <p className="mt-2 text-base-content/70 text-sm sm:text-md">Your subscription overview</p>
  </div>

  {/* Credits Usage Card */}
  <div className="mt-8 bg-base-100 rounded-xl p-6 shadow-sm border border-base-200">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Progress Bar Section */}
      <div className="w-full md:w-2/3 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary">Credits Used</h2>
          <span className="text-sm font-medium">
            {creditsUsed} / {totalCredits} credits
          </span>
        </div>
        <progress
          className="progress progress-primary w-full h-3"
          value={creditsUsed}
          max={totalCredits}
        ></progress>
      </div>

      {/* Radial Progress Indicator */}
      <div className="relative">
        <div
          className="radial-progress text-primary"
          style={{ "--value": percentageUsed, "--size": "5rem", "--thickness": "8px" }}
          role="progressbar"
        >
          <span className="text-sm font-bold">{Math.round(percentageUsed)}%</span>
        </div>
      </div>
    </div>
  </div>

  {/* Subscription Details Card */}
  <div className="mt-6 bg-base-100 rounded-xl p-6 shadow-sm border border-base-200">
    <h2 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-base-200">
      Subscription Details
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div>
          <p className="text-sm text-base-content/60">Plan</p>
          <p className="font-medium">{plan?.name}</p>
        </div>
        <div>
          <p className="text-sm text-base-content/60">Price</p>
          <p className="font-medium">₹{plan?.price}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-base-content/60">Total Credits</p>
          <p className="font-medium">{totalCredits}</p>
        </div>
        <div>
          <p className="text-sm text-base-content/60">Renewal Date</p>
          <p className="font-medium">{formattedDate}</p>
        </div>
      </div>
      
      <div className="md:col-span-2 pt-2">
        <p className="text-sm text-base-content/60 mb-1">Status</p>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status === "Active" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  </div>


  
</motion.div>
  );
};

export default PurchasesPage;


