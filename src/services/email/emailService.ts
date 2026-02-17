import { supabase } from '@/integrations/supabase/client';

type EmailType = 'booking_confirmation' | 'donation_receipt' | 'contact_acknowledgment' | 'priest_application_status';

interface SendEmailParams {
  type: EmailType;
  to: string;
  data: Record<string, any>;
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: params,
    });
    if (error) {
      console.warn('Email send failed (non-blocking):', error.message);
    }
  } catch (err) {
    // Email failures should not block the user flow
    console.warn('Email service unavailable:', err);
  }
}
