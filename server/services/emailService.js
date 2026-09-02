import resend from '../config/resend.js';
import { store } from '../database/inMemoryStore.js';
import dotenv from 'dotenv';
dotenv.config();

const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'hello@luminablinds.com';
const BUSINESS_NAME = process.env.BUSINESS_NAME || 'Lumina Window Treatments';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

// Reusable email wrapper template
const wrapTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BUSINESS_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #252525;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f5f0; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e2da; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0">
          <!-- Brand Header -->
          <tr>
            <td style="background-color: #252525; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
                Lumina <span style="color: #d4af37; font-weight: 300;">Window Treatments</span>
              </h1>
              <p style="color: #a0a0a0; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">
                Gaithersburg, MD • DC • Northern Virginia
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 28px;">
              ${content}
            </td>
          </tr>

          <!-- Brand Footer -->
          <tr>
            <td style="background-color: #faf9f6; padding: 24px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #777; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #444;">
                ${BUSINESS_NAME} • Gaithersburg Headquarters
              </p>
              <p style="margin: 0 0 6px 0;">
                101 Lakeforest Blvd, Suite 200, Gaithersburg, MD 20877
              </p>
              <p style="margin: 0;">
                Direct Client Dispatch: <a href="tel:18005550199" style="color: #252525; font-weight: bold; text-decoration: none;">(800) 555-0199</a> | 
                <a href="${FRONTEND_URL}" style="color: #252525; text-decoration: underline;">luminablinds.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Helper to record in-memory audit logs
function logEmailEvent(logEntry) {
  if (!store.email_logs) store.email_logs = [];
  store.email_logs.unshift(logEntry);
  if (store.email_logs.length > 100) store.email_logs.pop();
}

// Generic helper to send or log in dev
async function sendEmail({ to, subject, html, text }) {
  const fullHtml = wrapTemplate(html);

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: `${BUSINESS_NAME} <onboarding@resend.dev>`,
        to,
        subject,
        html: fullHtml,
        text
      });

      // Resend returns { data, error }
      const resData = response?.data || (response?.id ? response : null);
      const resError = response?.error || null;

      if (resError) {
        const isSandboxRestricted = (resError.message || '').toLowerCase().includes('testing email') || 
                                    (resError.message || '').toLowerCase().includes('verify your domain') ||
                                    (resError.message || '').toLowerCase().includes('only send');

        const logEntry = {
          id: `email-${Date.now()}`,
          to,
          subject,
          timestamp: new Date().toISOString(),
          status: 'failed',
          error_message: resError.message,
          error_code: resError.statusCode || resError.name || 'API_ERROR',
          is_sandbox_restricted: isSandboxRestricted
        };
        logEmailEvent(logEntry);

        console.error(`❌ Resend delivery rejected to ${to}:`, resError.message);
        return { success: false, error: resError.message, details: resError };
      }

      const emailId = resData?.id || response?.id || 'ok';
      const logEntry = {
        id: `email-${Date.now()}`,
        to,
        subject,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        resend_id: emailId,
        error_message: null
      };
      logEmailEvent(logEntry);

      console.log(`📧 Email delivered via Resend to ${to} | Subject: "${subject}" | ID: ${emailId}`);
      return { success: true, id: emailId };
    } catch (err) {
      const isSandboxRestricted = (err.message || '').toLowerCase().includes('testing email') || 
                                  (err.message || '').toLowerCase().includes('verify your domain');

      const logEntry = {
        id: `email-${Date.now()}`,
        to,
        subject,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error_message: err.message,
        is_sandbox_restricted: isSandboxRestricted
      };
      logEmailEvent(logEntry);

      console.error(`❌ Resend exception sending to ${to}:`, err.message);
      return { success: false, error: err.message };
    }
  } else {
    const logEntry = {
      id: `email-${Date.now()}`,
      to,
      subject,
      timestamp: new Date().toISOString(),
      status: 'mock_delivered',
      mock: true
    };
    logEmailEvent(logEntry);

    console.log(`\n📨 [MOCK EMAIL DISPATCH] To: ${to} | Subject: ${subject}`);
    return { success: true, mock: true };
  }
}

// 1. New Lead Alert to Business Owner
export async function sendNewLeadAlert(lead) {
  return sendEmail({
    to: BUSINESS_EMAIL,
    subject: `🚨 New Lead: ${lead.name} (${lead.city || 'Gaithersburg, MD'}) [${lead.source || 'Website'}]`,
    html: `
      <h2 style="color: #252525; margin-top: 0; font-size: 20px;">New Consultation Request Received!</h2>
      <p style="color: #555; line-height: 1.5;">A new homeowner has requested information through the Lumina platform:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee; width: 35%;">Customer Name:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.name}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${lead.phone}" style="color: #2e7d32; font-weight: bold;">${lead.phone} (1-Tap Dial)</a></td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${lead.email}" style="color: #252525;">${lead.email}</a></td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Location:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.address || 'Address on file'}, ${lead.city || 'Gaithersburg'} ${lead.zip || ''}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Channel / Source:</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${lead.source}</span></td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Campaign Attribution:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.utm_campaign || 'Direct'} (${lead.utm_source || 'organic'})</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Customer Notes:</td><td style="padding: 10px; color: #666;">${lead.notes || 'None provided'}</td></tr>
      </table>

      <div style="margin-top: 25px; text-align: center;">
        <a href="${FRONTEND_URL}/admin" style="background: #252525; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open in Admin CRM Hub</a>
      </div>
    `
  });
}

// 2. Booking Confirmation to Customer & Alert to Owner
export async function sendBookingConfirmation(booking, customerEmail) {
  // Alert to Owner
  await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `📅 New In-Home Consultation: ${booking.name || 'Customer'} on ${booking.date} at ${booking.time}`,
    html: `
      <h2 style="color: #252525; margin-top: 0;">New In-Home Consultation Booked!</h2>
      <p><strong>Customer:</strong> ${booking.name || 'Customer'} (<a href="tel:${booking.phone}">${booking.phone || 'No phone'}</a>)</p>
      <p><strong>Appointment:</strong> ${booking.date} at ${booking.time}</p>
      <p><strong>Location:</strong> ${booking.address}</p>
      <p><strong>Scope:</strong> ${booking.window_count || '1-5'} windows across ${booking.room_count || '1-3'} rooms</p>
      <p><strong>Notes:</strong> ${booking.notes || 'None'}</p>
      <div style="margin-top: 20px;">
        <a href="${FRONTEND_URL}/admin" style="background: #252525; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Bookings Schedule</a>
      </div>
    `
  });

  // Confirmation to Customer
  if (customerEmail || booking.email) {
    return sendEmail({
      to: customerEmail || booking.email,
      subject: `Your In-Home Window Consultation is Confirmed — ${BUSINESS_NAME}`,
      html: `
        <h2 style="color: #252525; margin-top: 0; font-size: 22px;">Your In-Home Consultation is Confirmed!</h2>
        <p>Hi ${booking.name || 'there'},</p>
        <p style="color: #555; line-height: 1.6;">Thank you for choosing ${BUSINESS_NAME}. Our licensed measuring specialist will arrive at your home with fabric books, motorized demonstrators, and optical laser measuring tools.</p>
        
        <div style="background: #f7f5f0; border-left: 4px solid #d4af37; padding: 16px; border-radius: 0 6px 6px 0; margin: 24px 0;">
          <p style="margin: 4px 0; font-size: 15px;"><strong>📅 Date:</strong> ${booking.date}</p>
          <p style="margin: 4px 0; font-size: 15px;"><strong>⏰ Arrival Window:</strong> ${booking.time}</p>
          <p style="margin: 4px 0; font-size: 15px;"><strong>📍 Service Address:</strong> ${booking.address}</p>
        </div>

        <h3 style="color: #252525; font-size: 16px; margin-bottom: 8px;">What We Bring to Your Appointment:</h3>
        <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
          <li>Exact 1/16" laser window opening measurements (100% Fit Guarantee)</li>
          <li>Designer fabric sample books to test directly under your room's natural lighting</li>
          <li>An instant itemized price quote with zero obligation or sales pressure</li>
        </ul>

        <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #eee; font-size: 13px; color: #777;">
          Need to reschedule? Reply directly to this email or call dispatch at <strong>(800) 555-0199</strong> at least 48 hours prior to your visit.
        </div>
      `
    });
  }
}

// 3. Welcome & Email Verification
export async function sendWelcomeEmail(customer, token) {
  const verifyLink = `${FRONTEND_URL}/verify-email/${token}`;
  return sendEmail({
    to: customer.email,
    subject: `Welcome to ${BUSINESS_NAME} — Please verify your account`,
    html: `
      <h2 style="color: #252525; margin-top: 0;">Welcome, ${customer.first_name}!</h2>
      <p style="color: #555; line-height: 1.6;">Thank you for creating your customer account with ${BUSINESS_NAME}. You can now view saved quotes, track custom orders in production, order free swatch kits, and manage your consultation schedule.</p>
      
      <div style="margin: 28px 0; text-align: center;">
        <a href="${verifyLink}" style="background: #252525; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email & Open Dashboard</a>
      </div>
      
      <p style="font-size: 12px; color: #888; text-align: center;">Link expired or having trouble? Copy this link: ${verifyLink}</p>
    `
  });
}

// 4. Password Reset Email
export async function sendPasswordResetEmail(email, token) {
  const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
  return sendEmail({
    to: email,
    subject: `Reset your ${BUSINESS_NAME} Password`,
    html: `
      <h2 style="color: #252525; margin-top: 0;">Password Reset Request</h2>
      <p style="color: #555; line-height: 1.6;">We received a request to reset your Lumina account password. Click the secure link below to set a new password:</p>
      
      <div style="margin: 28px 0; text-align: center;">
        <a href="${resetLink}" style="background: #596052; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      
      <p style="font-size: 12px; color: #888;">This secure reset token is valid for 1 hour. If you did not request this, please ignore this email.</p>
    `
  });
}

// 5. Quote Sent to Customer with Stripe Deposit Link
export async function sendQuoteEmail(quote, customerEmail, customerName) {
  const payDepositLink = `${FRONTEND_URL}/account?quote=${quote.id}`;
  return sendEmail({
    to: customerEmail,
    subject: `Your Custom Window Treatment Quote #${quote.id.slice(0, 8)} — ${BUSINESS_NAME}`,
    html: `
      <h2 style="color: #252525; margin-top: 0; font-size: 22px;">Your Custom Quote is Ready</h2>
      <p>Hi ${customerName || 'there'},</p>
      <p style="color: #555; line-height: 1.6;">Here is the customized quote breakdown for your window treatment project:</p>

      <div style="background: #f7f5f0; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e5e2da;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr><td style="padding: 6px 0; color: #666;">Product Selection:</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${quote.product_type}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Window Count:</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${quote.window_count} custom units</td></tr>
          <tr style="border-top: 1px solid #ddd;"><td style="padding: 12px 0 6px; font-weight: bold; font-size: 16px;">Total Installed Price:</td><td style="padding: 12px 0 6px; font-size: 20px; font-weight: bold; text-align: right; color: #252525;">$${quote.total_price.toFixed(2)}</td></tr>
          <tr><td style="padding: 4px 0; color: #2e7d32; font-weight: bold;">50% Deposit to Start Fabrication:</td><td style="padding: 4px 0; font-weight: bold; text-align: right; color: #2e7d32;">$${quote.deposit_amount.toFixed(2)}</td></tr>
          <tr><td style="padding: 4px 0; color: #666; font-size: 13px;">Balance upon Final Installation:</td><td style="padding: 4px 0; text-align: right; color: #666; font-size: 13px;">$${quote.balance_due.toFixed(2)}</td></tr>
        </table>
      </div>

      <div style="margin: 28px 0; text-align: center;">
        <a href="${payDepositLink}" style="background: #252525; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
          Review Quote & Pay Deposit Online &rarr;
        </a>
      </div>

      <p style="font-size: 13px; color: #777; line-height: 1.6; text-align: center;">
        Protected by our <strong>100% Perfect Fit Guarantee</strong> and Limited Lifetime Hardware Warranty.
      </p>
    `
  });
}

// 6. Post-Installation Google Review Request
export async function sendReviewRequestEmail(customer) {
  const googleReviewLink = `https://g.page/r/your-google-review-link/review`;
  return sendEmail({
    to: customer.email,
    subject: `How did we do? — ${BUSINESS_NAME}`,
    html: `
      <h2 style="color: #252525; margin-top: 0;">Hi ${customer.first_name || 'there'},</h2>
      <p style="color: #555; line-height: 1.6;">Thank you for trusting ${BUSINESS_NAME} with your home! Our technician has certified and completed the installation of your custom window treatments.</p>
      <p style="color: #555; line-height: 1.6;">Would you mind taking 30 seconds to share your experience on Google? Local reviews mean the world to our small Maryland family-owned team.</p>
      
      <div style="margin: 28px 0; text-align: center;">
        <a href="${googleReviewLink}" style="background: #D4AF37; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 15px;">
          ⭐ Leave a Quick Google Review
        </a>
      </div>
      
      <p style="font-size: 13px; color: #777; line-height: 1.6;">If any treatment needs tension calibration or adjustment, please reply directly so we can service it under your Lifetime Craftsmanship Guarantee.</p>
    `
  });
}

// 7. Sample Request Confirmation with Detailed Color & Fabric List
export async function sendSampleConfirmationEmail(sampleRequest) {
  const colorsList = Array.isArray(sampleRequest.colors) && sampleRequest.colors.length > 0 
    ? sampleRequest.colors 
    : (sampleRequest.colors ? [sampleRequest.colors] : ['Pure White', 'Oatmeal Linen', 'Warm Gray']);

  const colorsHtml = colorsList
    .map(c => `<span style="background: #ffffff; border: 1px solid #dcd8cf; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 13px; margin-right: 6px; display: inline-block; margin-bottom: 6px;">🎨 ${c}</span>`)
    .join('');

  return sendEmail({
    to: sampleRequest.email,
    subject: `Your Free Fabric Swatches are on the Way! — ${BUSINESS_NAME}`,
    html: `
      <h2 style="color: #252525; margin-top: 0; font-size: 22px;">Your Free Swatch Kit is on Its Way!</h2>
      <p style="font-size: 15px;">Hi ${sampleRequest.name || 'there'},</p>
      <p style="color: #555; line-height: 1.6;">
        We've received your request for custom window treatment fabric samples. Our Gaithersburg sample department is custom-packaging your physical swatch kit for:
      </p>

      <!-- Itemized Swatch Details Box -->
      <div style="background: #f7f5f0; border: 1px solid #e5e2da; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 12px 0; color: #252525; font-size: 16px; border-bottom: 1px solid #e0ddd4; padding-bottom: 8px;">
          📦 Swatch Package Details
        </h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #666; width: 35%; font-weight: 500;">Product Collection:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #252525;">${sampleRequest.product_name || 'Custom Window Shades'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666; font-weight: 500;">Selected Fabrics / Colors:</td>
            <td style="padding: 6px 0;">
              ${colorsHtml}
            </td>
          </tr>
          ${sampleRequest.opacity ? `
          <tr>
            <td style="padding: 6px 0; color: #666; font-weight: 500;">Light Control / Opacity:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #596052;">${sampleRequest.opacity}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 6px 0; color: #666; font-weight: 500;">Mailing Address:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #252525;">${sampleRequest.address}, ${sampleRequest.zip}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666; font-weight: 500;">Delivery Method:</td>
            <td style="padding: 6px 0; color: #2e7d32; font-weight: bold;">USPS First-Class Priority (2–4 Business Days)</td>
          </tr>
        </table>
      </div>

      <!-- Designer Tips -->
      <div style="background: #ffffff; border-left: 4px solid #d4af37; padding: 16px; border-radius: 0 6px 6px 0; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; color: #252525; font-size: 15px;">💡 How to Test Your Swatches:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.7; font-size: 13px;">
          <li><strong>Hold against daylight:</strong> Place the swatches up to your windows at 9:00 AM, 1:00 PM, and sunset to see how natural lighting filters through the weave.</li>
          <li><strong>Check wall paint & trim:</strong> View the swatches directly against your window trim and wall color.</li>
          <li><strong>Touch the texture:</strong> Feel the weighted hem and fabric weave quality.</li>
        </ul>
      </div>

      <p style="color: #777; font-size: 13px; line-height: 1.6;">
        Ready for exact laser measurements and an instant price quote? Reply to this email or call <strong>(800) 555-0199</strong> to schedule your free in-home consultation.
      </p>
    `
  });
}

// 8. Lead & Free In-Home Measurement Request Confirmation to Customer
export async function sendLeadConfirmationToCustomer(lead) {
  if (!lead || !lead.email) return;
  return sendEmail({
    to: lead.email,
    subject: `We received your consultation request — ${BUSINESS_NAME}`,
    html: `
      <h2 style="color: #252525; margin-top: 0; font-size: 22px;">Thank you for reaching out, ${lead.name}!</h2>
      <p style="color: #555; line-height: 1.6;">We have received your in-home window measurement and consultation request for your property in <strong>${lead.city || 'the DMV Area'}</strong>.</p>
      
      <div style="background: #f7f5f0; border-left: 4px solid #d4af37; padding: 18px; border-radius: 0 6px 6px 0; margin: 24px 0;">
        <h4 style="margin: 0 0 10px 0; color: #252525; font-size: 16px;">What Happens Next:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
          <li>A Lumina measurement specialist will review your project details and contact you at <strong>${lead.phone}</strong> within 2 business hours.</li>
          <li>We will schedule a convenient in-home visit with laser measuring tools and full designer fabric sample books.</li>
          <li>You will receive an itemized, exact-price quote with zero sales pressure and our <strong>100% Guaranteed Fit Promise</strong>.</li>
        </ul>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 13px; color: #777;">
        Need immediate assistance? Call our Gaithersburg client dispatch at <strong>(800) 555-0199</strong> (Mon–Sat 8:00 AM – 7:00 PM).
      </div>
    `
  });
}

// 9. Admin Email System Health Check / Diagnostic Test
export async function sendDiagnosticTestEmail(targetEmail) {
  const testTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  return sendEmail({
    to: targetEmail,
    subject: `🩺 Email Health Check Passed — ${BUSINESS_NAME} [${testTime}]`,
    html: `
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="background: #e8f5e9; color: #2e7d32; font-weight: bold; padding: 6px 14px; border-radius: 20px; font-size: 14px;">
          ✅ Live Dispatch System Healthy
        </span>
      </div>
      <h2 style="color: #252525; margin-top: 0; font-size: 20px; text-align: center;">Resend API Integration Test</h2>
      <p style="color: #555; line-height: 1.6; text-align: center;">
        This diagnostic confirmation verifies that Lumina's automated email pipeline is fully connected and actively transmitting transactional messages.
      </p>

      <div style="background: #f7f5f0; border: 1px solid #e5e2da; border-radius: 6px; padding: 16px; margin: 20px 0; font-size: 13px;">
        <div><strong>Recipient:</strong> ${targetEmail}</div>
        <div style="margin-top: 4px;"><strong>Timestamp:</strong> ${testTime} EDT</div>
        <div style="margin-top: 4px;"><strong>Sender Identity:</strong> ${BUSINESS_NAME} &lt;onboarding@resend.dev&gt;</div>
        <div style="margin-top: 4px;"><strong>Status:</strong> <span style="color: #2e7d32; font-weight: bold;">Online & Operational</span></div>
      </div>
    `
  });
}
