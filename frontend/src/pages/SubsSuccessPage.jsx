import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../lib/axios';

const SubsSuccessPage = () => {
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Move verifyPayment outside useEffect and memoize it
  const verifyPayment = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const subscriptionIntent = urlParams.get('payment_intent');
      const redirectStatus = urlParams.get('redirect_status');

      // Check localStorage to see if this payment was already processed
      const processedPayment = localStorage.getItem(`payment_${subscriptionIntent}`);
      if (processedPayment) {
        setError('This payment has already been processed');
        setLoading(false);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!subscriptionIntent || !redirectStatus || !creatorId) {
        throw new Error('Missing payment information');
      }

      if (redirectStatus !== 'succeeded') {
        throw new Error('Payment was not successful');
      }

      // Mark this payment as being processed
      localStorage.setItem(`payment_${subscriptionIntent}`, 'processing');

      const response = await axios.post('/subscription/verify-subscription', {
        subscriptionIntentId: subscriptionIntent,
        creatorId: creatorId
      });

      // If verification successful, mark payment as completed
      localStorage.setItem(`payment_${subscriptionIntent}`, 'completed');
      
      setVerificationComplete(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Payment verification error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during payment verification';
      
      // Clear processing state if there was an error
      const urlParams = new URLSearchParams(window.location.search);
      const subscriptionIntent = urlParams.get('payment_intent');
      if (subscriptionIntent) {
        localStorage.removeItem(`payment_${subscriptionIntent}`);
      }

      setError(errorMessage);
      
      if (errorMessage.includes('already been processed') || 
          errorMessage.includes('active subscription')) {
        setTimeout(() => navigate('/'), 3000);
      } else {
        setTimeout(() => navigate('/subscribe-ai'), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [creatorId, navigate]);

  useEffect(() => {

    if (!verificationComplete && !error) {
      verifyPayment();
    }

    return () => {
      const urlParams = new URLSearchParams(window.location.search);
      const subscriptionIntent = urlParams.get('payment_intent');
      if (subscriptionIntent) {
        localStorage.removeItem(`payment_${subscriptionIntent}`);
      }
    };
  }, [verifyPayment, verificationComplete, error]);

  if (loading) {
    return (
      <div className="bg-base-300 shadow-lg rounded-3xl my-20 container mx-auto px-10 py-10 max-w-3xl">
        <div className="text-center p-8 bg-base-100 rounded-xl shadow-xl w-96 mx-auto">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-700 font-semibold">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isActiveSubscriptionError = error.includes('active subscription') || 
                                    error.includes('already been processed') ||
                                    error.includes('This payment has already been processed');
    return (
      <div className="bg-base-300 shadow-lg rounded-3xl my-20 container mx-auto px-10 py-10 max-w-3xl">
        <div className="text-center p-8 bg-base-100 rounded-xl shadow-xl w-96 mx-auto border border-error">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-bold mb-2">{error}</p>
          <p className="text-gray-700">
            {isActiveSubscriptionError 
              ? 'Redirecting to dashboard in 3 seconds...'
              : 'Redirecting back to subscription page in 3 seconds...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-300 shadow-lg rounded-3xl my-20 container mx-auto px-10 py-10 max-w-3xl">
      <div className="text-center p-8 bg-base-100 rounded-xl shadow-xl w-96 mx-auto border border-success">
        <div className="text-green-500 text-4xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700">Thank you for your subscription.Refresh page after payment</p>
        <p className="text-gray-600 mt-2">Redirecting to dashboard in 3 seconds...</p>
      </div>
    </div>
  );
};

export default SubsSuccessPage;