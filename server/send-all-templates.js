import dotenv from 'dotenv';
import { sendWelcomeEmail, sendQuoteEmail, sendBookingConfirmation } from './services/emailService.js';

dotenv.config();

const TARGET_EMAIL = 'asad.adeel@gmail.com';

async function sendAllTemplates() {
  console.log(`🚀 Sending full lifecycle email suite to ${TARGET_EMAIL}...`);

  // 1. Welcome & Account Verification
  console.log('1. Sending Welcome & Verification email...');
  await sendWelcomeEmail(
    { first_name: 'Adeel', email: TARGET_EMAIL },
    'vt_sample_verification_token_123'
  );

  // 2. Custom Quote with 50% Deposit Breakdown
  console.log('2. Sending Custom Quote & Deposit email...');
  await sendQuoteEmail(
    {
      id: 'quote-482910',
      product_type: 'Custom Motorized Solar Roller Shades (Somfy Whisper Motors)',
      window_count: 6,
      total_price: 1840.00,
      deposit_amount: 920.00,
      balance_due: 920.00
    },
    TARGET_EMAIL,
    'Adeel Asad'
  );

  // 3. Consultation Confirmation
  console.log('3. Sending In-Home Consultation Confirmation email...');
  await sendBookingConfirmation(
    {
      name: 'Adeel Asad',
      phone: '857-222-9207',
      email: TARGET_EMAIL,
      date: 'Tuesday, Sept 8, 2026',
      time: '10:00 AM - 12:00 PM',
      address: 'Gaithersburg, MD 20878',
      window_count: '6 windows',
      room_count: 'Living Room & Master Suite',
      notes: 'Please bring sample books for linen and solar 3% fabrics'
    },
    TARGET_EMAIL
  );

  console.log('\n🎉 ALL 3 LIFECYCLE EMAILS DISPATCHED SUCCESSFULLY VIA RESEND!');
}

sendAllTemplates();
