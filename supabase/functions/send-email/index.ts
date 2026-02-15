import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Divine Guidance <noreply@divineguidance.in>";

interface EmailPayload {
  type:
    | "booking_confirmation"
    | "donation_receipt"
    | "contact_acknowledgment"
    | "priest_application_status";
  to: string;
  data: Record<string, any>;
}

function getEmailContent(payload: EmailPayload): { subject: string; html: string } {
  const { type, data } = payload;

  switch (type) {
    case "booking_confirmation":
      return {
        subject: `Booking Confirmed — ${data.purpose || "Spiritual Service"}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #8B4513; border-bottom: 2px solid #DAA520; padding-bottom: 12px;">
              Booking Confirmed
            </h1>
            <p>Namaste <strong>${data.user_name || "Devotee"}</strong>,</p>
            <p>Your booking has been confirmed. Here are the details:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 8px; color: #666;">Priest</td><td style="padding: 8px; font-weight: bold;">${data.priest_name || "N/A"}</td></tr>
              <tr style="background: #f9f5f0;"><td style="padding: 8px; color: #666;">Purpose</td><td style="padding: 8px;">${data.purpose || "N/A"}</td></tr>
              <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px;">${data.booking_date || "N/A"}</td></tr>
              <tr style="background: #f9f5f0;"><td style="padding: 8px; color: #666;">Address</td><td style="padding: 8px;">${data.address || "N/A"}</td></tr>
              <tr><td style="padding: 8px; color: #666;">Amount</td><td style="padding: 8px;">₹${data.price || "0"}</td></tr>
            </table>
            <p style="color: #666; font-size: 14px;">You can track your booking in your <a href="${data.app_url || "#"}/profile" style="color: #DAA520;">profile</a>.</p>
            <p style="margin-top: 24px;">Om Shanti,<br/><strong>Divine Guidance Team</strong></p>
          </div>
        `,
      };

    case "donation_receipt":
      return {
        subject: `Donation Receipt — ₹${data.amount || "0"}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #8B4513; border-bottom: 2px solid #DAA520; padding-bottom: 12px;">
              Thank You for Your Generosity
            </h1>
            <p>Namaste <strong>${data.donor_name || "Devotee"}</strong>,</p>
            <p>We have received your donation. Your contribution makes a meaningful difference.</p>
            <div style="background: #f9f5f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Amount:</strong> ₹${data.amount || "0"}</p>
              <p style="margin: 8px 0 0;"><strong>Payment ID:</strong> ${data.payment_id || "N/A"}</p>
              <p style="margin: 8px 0 0;"><strong>Date:</strong> ${data.date || new Date().toLocaleDateString()}</p>
            </div>
            ${data.message ? `<p><em>"${data.message}"</em></p>` : ""}
            <p style="color: #666; font-size: 13px;">This receipt may be used for tax exemption under Section 80G of the Income Tax Act.</p>
            <p style="margin-top: 24px;">Om Shanti,<br/><strong>Divine Guidance Team</strong></p>
          </div>
        `,
      };

    case "contact_acknowledgment":
      return {
        subject: `We received your message — ${data.subject || "Contact"}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #8B4513; border-bottom: 2px solid #DAA520; padding-bottom: 12px;">
              Message Received
            </h1>
            <p>Namaste <strong>${data.name || "Visitor"}</strong>,</p>
            <p>Thank you for reaching out. We have received your message and will respond within 24-48 hours.</p>
            <div style="background: #f9f5f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Subject:</strong> ${data.subject || "N/A"}</p>
              <p style="margin: 8px 0 0;"><strong>Message:</strong> ${data.message || "N/A"}</p>
            </div>
            <p style="margin-top: 24px;">Om Shanti,<br/><strong>Divine Guidance Team</strong></p>
          </div>
        `,
      };

    case "priest_application_status":
      const isApproved = data.status === "approved";
      return {
        subject: `Priest Application ${isApproved ? "Approved" : "Update"}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #8B4513; border-bottom: 2px solid #DAA520; padding-bottom: 12px;">
              Application ${isApproved ? "Approved" : "Status Update"}
            </h1>
            <p>Namaste <strong>${data.name || "Applicant"}</strong>,</p>
            ${
              isApproved
                ? `<p>We are pleased to inform you that your priest application has been <strong style="color: green;">approved</strong>. You can now access the Priest Dashboard to manage your profile, bookings, and teachings.</p>
                   <p><a href="${data.app_url || "#"}/priest" style="display: inline-block; background: #DAA520; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 8px;">Go to Priest Dashboard</a></p>`
                : `<p>Your priest application status has been updated to: <strong>${data.status}</strong>.</p>
                   ${data.reason ? `<p>Reason: ${data.reason}</p>` : ""}
                   <p>If you have questions, please contact us through the Contact page.</p>`
            }
            <p style="margin-top: 24px;">Om Shanti,<br/><strong>Divine Guidance Team</strong></p>
          </div>
        `,
      };

    default:
      return {
        subject: "Notification from Divine Guidance",
        html: `<p>You have a new notification. Please visit your profile for details.</p>`,
      };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — email not sent");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: EmailPayload = await req.json();
    const { subject, html } = getEmailContent(payload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [payload.to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await res.json();
    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
