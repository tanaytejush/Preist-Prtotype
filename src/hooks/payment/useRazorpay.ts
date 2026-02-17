import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface PaymentOptions {
  amount: number;
  type: 'donation' | 'service_booking' | 'priest_booking';
  metadata?: Record<string, any>;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}

async function invokeEdgeFunction(fnName: string, body: Record<string, any>) {
  // Use the user's JWT if logged in, otherwise fall back to anon key
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token || SUPABASE_ANON_KEY;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `Edge Function error (${res.status})`);
  }

  return data;
}

export function useRazorpay() {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = async (options: PaymentOptions) => {
    const { amount, type, metadata = {}, prefill, onSuccess, onFailure } = options;

    if (!window.Razorpay) {
      onFailure('Razorpay SDK not loaded. Please refresh the page and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order via Edge Function
      const orderData = await invokeEdgeFunction('create-razorpay-order', {
        amount, currency: 'INR', type, metadata,
      });

      if (!orderData.order_id) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      const { order_id, amount: amountInPaise, currency } = orderData;

      // 2. Open Razorpay Checkout
      const razorpayOptions: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency,
        name: 'Divine Guidance',
        description: type === 'donation' ? 'Donation' : 'Service Booking',
        order_id,
        prefill: prefill || {},
        theme: { color: '#E8913A' },
        handler: async (paymentResponse: RazorpayResponse) => {
          try {
            // 3. Verify payment via Edge Function
            const verifyData = await invokeEdgeFunction('verify-razorpay-payment', {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            onSuccess(paymentResponse.razorpay_payment_id);
          } catch (err: any) {
            onFailure(err.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            onFailure('Payment was cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (err: any) {
      setIsProcessing(false);
      onFailure(err.message || 'An error occurred while initiating payment');
    }
  };

  return { initiatePayment, isProcessing };
}
