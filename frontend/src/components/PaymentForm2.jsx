/* eslint-disable react/prop-types */
// import React from 'react'

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useState } from "react";

const PaymentForm2 = ({creatorId,onError}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleSubmit  = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            return;
        }

        try {
            const { error } = await stripe.confirmPayment({
              elements,
              confirmParams: {
                return_url: `${window.location.origin}/subs/success/${creatorId}`,
                // payment_method_data: {
                // }
              },
            });
        
            if (error) {
              throw new Error(error.message);
            }
          } catch (err) {
            setError(err.message);
            onError(err);
          } finally {
            setLoading(false);
          }
    }
  return (
    <form
     onSubmit={handleSubmit}
     className="space-y-4">
      <PaymentElement />
      {error && <div className="text-error text-sm">{error}</div>}
      <button 
        type="submit" 
        className="btn btn-primary w-full" 
        disabled={loading || !stripe}
      >
        {loading ? "Processing..." : "Subscribe"}
      </button>
    </form>
  )
}

export default PaymentForm2
