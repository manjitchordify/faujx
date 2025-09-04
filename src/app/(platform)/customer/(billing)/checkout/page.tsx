'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FiAlertCircle } from 'react-icons/fi';
import { usePayment } from '@/contexts/PaymentContext';
import CheckoutForm from '@/components/billing/CheckoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = () => {
  const { clientSecret } = usePayment();

  if (!clientSecret) {
    return (
      <div className="py-16 min-h-[calc(100vh-14.5625rem)] grid place-content-center">
        <div className="w-11/12 max-w-md mx-auto mt-10 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-sm font-semibold mb-1">Payment Error</h2>
            <p className="text-sm">
              We couldn&apos;t initiate the checkout session. Please try again
              later or contact support if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
