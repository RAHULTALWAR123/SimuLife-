/* eslint-disable react/prop-types */
// import React from 'react'

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PaymentForm2 from "./PaymentForm2";
import axios from '../lib/axios';

const stripePromise = loadStripe('pk_test_51PnOw8BJ0hUb0185GFQvZXjuU18OKVlWvoRJI0JZ6QQqFXxinYbg4gVUEAFU1ycm4tf4cCRPaygPsvZnLyN6eyIV00Y1WWrpyK');


const SubsModal = ({ user ,isOpen, onClose }) => {
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    if (user && isOpen) {
        const createIntent = async () => {
            try {
                setLoading(true);
                const response = await axios.post("/subscription/create-subscription-intent", {
                    creatorId : user._id
                })
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                if (error.response?.status === 400 && error.response?.data?.message === 'You already have an active subscription') {
                    toast.error('You already have an active subscription');
                    onClose();
                } else {
                    toast.error(error.response?.data?.message || 'Failed to initiate payment');
                }
                console.error('Error creating payment intent:', error);
                } finally {
                setLoading(false);
                }
        }

        createIntent();
    }
    }, [user, isOpen , onClose]);


    if (loading) {
        return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
            <div className="flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
            </div>
        </dialog>
        );
    }

    if (!clientSecret) {
        return null;
    }


  return (

    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Subscribe to {user?.name}</h3>
        <Elements stripe={stripePromise}
         options={{ clientSecret }}
         >
          <PaymentForm2 
            creatorId={user?._id}
            onSuccess={() => {
              toast.success('Successfully subscribed!');
              onClose();
              window.location.reload();
            }}
            onError={(error) => {
              toast.error(error.message || 'Payment failed. Please try again.');
              console.error('Payment failed:', error);
            }}
          />
        </Elements>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </dialog>
  )
}

export default SubsModal
