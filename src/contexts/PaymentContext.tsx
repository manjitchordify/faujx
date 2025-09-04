'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';

// type PaymentMetadata = {
//   orderId: string;
//   userId: string;
// };

// type CreatePaymentIntentPayload = {
//   amount: number;
//   currency: string;
//   customerId: string;
//   metadata: PaymentMetadata;
// };

type PaymentContextType = {
  clientSecret: string | null;
  isLoading: boolean;
  error: string | null;
  setClientSecret: React.Dispatch<React.SetStateAction<string | null>>;
  createPaymentIntent: () => Promise<void>;
};

const credentials = {
  email: 'superadmin@faujx.com',
  password: 'admin@123',
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async () => {
    if (accessToken === null) alert('You must be authenticated!');

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://devapi.faujx.com/api/stripe/payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount: 29.99,
            currency: 'usd',
            // customerId: 'cus_1234567890',
            metadata: { orderId: '12345', userId: '67890' },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to create payment intent: ${response.statusText}`
        );
      }

      const data = await response.json();
      setClientSecret(data.client_secret);
      router.push('/checkout');
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setClientSecret(null);
    } finally {
      setIsLoading(false);
    }
  }, [router, accessToken]);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch(
          'https://devapi.faujx.com/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          }
        );

        if (!response.ok) {
          throw new Error(`Login failed: ${response.statusText}`);
        }

        const { data } = await response.json();

        if (data.accessToken) {
          setAccessToken(data.accessToken);
          return data.accessToken;
        } else {
          throw new Error('Access token not found in response');
        }
      } catch (err: unknown) {
        console.log(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchAccessToken();
  }, []);

  return (
    <PaymentContext.Provider
      value={{
        clientSecret,
        isLoading,
        error,
        setClientSecret,
        createPaymentIntent,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
