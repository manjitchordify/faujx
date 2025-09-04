'use client';

import { useEffect, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import {
  useElements,
  useStripe,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { usePayment } from '@/contexts/PaymentContext';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const { clientSecret, setClientSecret } = usePayment();

  const [isReady, setIsReady] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (stripe == null || elements == null || clientSecret == null) {
        return;
      }

      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Invalid fields');
        return;
      }

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        clientSecret,
        confirmParams: {
          return_url: 'http://localhost:3000/checkout/success',
        },
      });

      if (error) {
        setError(error.message!);
      } else {
        // customer will be redirected to your `return_url`.
        setClientSecret(null);
      }
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  return (
    <div className="min-h-[calc(100vh-14.5625rem)] py-16 grid place-content-center">
      <form className="w-[90%] max-w-md" onSubmit={handleSubmit}>
        <PaymentElement
          onChange={e => {
            setIsPaymentReady(e.complete);
          }}
        />
        {error && (
          <div className="py-16 min-h-[calc(100vh-14.5625rem)] grid place-content-center">
            <div className="w-11/12 max-w-md mx-auto mt-10 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-sm font-semibold mb-1">Payment Error</h2>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        {isReady && isPaymentReady && (
          <button
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-[#3FAE2A] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#17403c] transition disabled:opacity-50 disabled:cursor-wait"
          >
            Submit
            {loading && (
              <span className="size-[18px] rounded-full border-2 border-white border-b-transparent" />
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
