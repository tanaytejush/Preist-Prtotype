import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentOptions {
  amount: number;
  type: 'donation' | 'service_booking' | 'priest_booking';
  metadata?: Record<string, any>;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        onFailure('You must be signed in to make a payment.');
        setIsProcessing(false);
        return;
      }

      const response = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, currency: 'INR', type, metadata },
      });

      if (response.error || !response.data?.order_id) {
        throw new Error(response.error?.message || 'Failed to create payment order');
      }

      const { order_id, amount: amountInPaise, currency } = response.data;

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
            const verifyResponse = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
            });

            if (verifyResponse.error || !verifyResponse.data?.success) {
              throw new Error(verifyResponse.error?.message || 'Payment verification failed');
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
