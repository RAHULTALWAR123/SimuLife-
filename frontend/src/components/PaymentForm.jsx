/* eslint-disable react/prop-types */
import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuthStore } from "../store/useAuthStore";
// import axios from "axios";

const PaymentForm = ({ planId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useAuthStore()

// In PaymentForm.jsx, update handleSubmit
const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!stripe || !elements) {
      return;
    }
  
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
          payment_method_data: {
            billing_details: {
              email: user.email // Add user's email if available
            }
          }
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
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};

export default PaymentForm; 