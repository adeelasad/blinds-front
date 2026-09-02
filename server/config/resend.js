import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;

let resend = null;

if (resendApiKey) {
  try {
    resend = new Resend(resendApiKey);
    console.log('✅ Resend email client initialized.');
  } catch (error) {
    console.error('❌ Failed to initialize Resend client:', error.message);
  }
} else {
  console.warn('⚠️ RESEND_API_KEY missing in .env. Email automation will log to console in mock mode.');
}

export { resend };
export default resend;
