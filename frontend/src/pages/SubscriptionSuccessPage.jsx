import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentId = urlParams.get('payment_intent');
        const redirectStatus = urlParams.get('redirect_status');

        // Log the values for debugging
        console.log('Payment Intent ID:', paymentIntentId);
        console.log('Redirect Status:', redirectStatus);

        if (!paymentIntentId || !redirectStatus) {
          throw new Error('Missing payment information');
        }

        if (redirectStatus !== 'succeeded') {
          throw new Error('Payment was not successful');
        }

        const response = await axios.post('/payments/verify-payment', {
          paymentIntentId,
          redirectStatus
        });

        console.log('Verification Response:', response.data); // Add this log

        if (response.data.success) {
          setVerificationComplete(true);
          // Show success message for 3 seconds before redirecting
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          throw new Error(response.data.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred during payment verification';
        setError(errorMessage);
        
        if (!errorMessage.includes('active subscription')) {
          setTimeout(() => {
            navigate('/subscribe-ai');
          }, 3000);
        } else {
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-base-300 shadow-lg rounded-3xl my-20 container mx-auto px-10 py-10 max-w-3xl">
        <div className="text-center p-8 bg-base-100 rounded-xl shadow-xl w-96">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-700 font-semibold">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isActiveSubscriptionError = error.includes('active subscription');
    return (
      <div className="bg-base-300 shadow-lg rounded-3xl my-20 container mx-auto px-10 py-10 max-w-3xl">
        <div className="text-center p-8 bg-base-100 rounded-xl shadow-xl w-96 border border-error">
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
      <div className="text-center p-8 bg-base-100 rounded-xl shadow-xl w-96 border border-success">
        <div className="text-green-500 text-4xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700">Thank you for your subscription. Refresh After Payment</p>
        <p className="text-gray-600 mt-2">Redirecting to dashboard in 3 seconds...</p>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage; 