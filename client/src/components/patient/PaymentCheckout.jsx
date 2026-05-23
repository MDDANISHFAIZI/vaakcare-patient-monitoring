import { useState } from 'react';
import axios from 'axios';
import { CreditCard, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentCheckout = ({ doctorId, amount = 500, onSuccess, buttonText = "Pay Now" }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await loadRazorpay();
      if (!res) {
        setError('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // Create order
      const result = await axios.post('https://vaakcare-patient-monitoring.onrender.com/api/payments/create-order', {
        doctorId,
        amount
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (!result.data) {
        setError('Server error. Are you online?');
        setLoading(false);
        return;
      }

      const { amount: orderAmount, orderId, currency, paymentId } = result.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key_id', // Add your Razorpay API key in env
        amount: orderAmount.toString(),
        currency: currency,
        name: 'VaakCare',
        description: 'Doctor Consultation Payment',
        order_id: orderId,
        handler: async function (response) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            payment_id: paymentId,
          };

          try {
            const verifyResult = await axios.post('https://vaakcare-patient-monitoring.onrender.com/api/payments/verify-payment', data, {
              headers: { Authorization: `Bearer ${user.token}` }
            });

            if (verifyResult.data.message === "Payment verified successfully") {
              alert('Payment Successful!');
              if (onSuccess) onSuccess(verifyResult.data);
            } else {
              alert('Payment Failed');
            }
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            alert('Payment Failed during verification.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to initiate payment. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div>
      <button 
        onClick={handleCheckout} 
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-slate-500/20 disabled:opacity-70"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
        {loading ? 'Processing...' : `${buttonText} (₹${amount})`}
      </button>
      {error && <p className="text-red-500 text-xs mt-2 text-center font-medium">{error}</p>}
    </div>
  );
};

export default PaymentCheckout;
