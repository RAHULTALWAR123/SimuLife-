/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe('pk_test_51PnOw8BJ0hUb0185GFQvZXjuU18OKVlWvoRJI0JZ6QQqFXxinYbg4gVUEAFU1ycm4tf4cCRPaygPsvZnLyN6eyIV00Y1WWrpyK');

const SubscriptionModal = ({ plan, isOpen, onClose }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const forceReload = () => {
    setTimeout(() => {
      window.location.reload(true); // true forces a hard reload from server
    }, 1000);
  };

  useEffect(() => {
    if (plan && isOpen) {
      const createIntent = async () => {
        try {
          setLoading(true);
          const response = await axios.post('/payments/create-payment-intent', {
            planId: plan._id
          });
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          if (error.response?.status === 400 && error.response?.data?.message === 'You already have an active subscription') {
            toast.error('You already have an active subscription');
          } else {
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
          }
          console.error('Error creating payment intent:', error);
          forceReload();
          onClose();
        } finally {
          setLoading(false);
        }
      };

      createIntent();
    }
  }, [plan, isOpen, onClose]);

  const handleSuccess = () => {
    toast.success('Successfully subscribed!');
    forceReload();
    onClose();
  };

  const handleError = (error) => {
    toast.error(error.message || 'Payment failed. Please try again.');
    console.error('Payment failed:', error);
    forceReload();
  };

  const handleClose = () => {
    onClose();
    forceReload();
  };

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
        <h3 className="font-bold text-lg mb-4">Subscribe to {plan?.name}</h3>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm 
            planId={plan?._id}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Elements>
        <div className="modal-action">
          <button className="btn" onClick={handleClose}>Close</button>
        </div>
      </div>
    </dialog>
  );
};

export default SubscriptionModal;