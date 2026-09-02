import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function testEmailSend() {
  console.log('Testing actual email send via Resend with sending-restricted key...');
  const resend = new Resend(RESEND_API_KEY);

  try {
    // When using Resend test domain 'onboarding@resend.dev', you can send to the account owner's email address
    // Or we test sending an email payload
    const { data, error } = await resend.emails.send({
      from: 'Lumina Window Treatments <onboarding@resend.dev>',
      to: 'delivered@resend.dev', // Resend official test sink address
      subject: '✅ Lumina Live Email Automation Test',
      html: '<h2>Lumina Window Treatments</h2><p>Your Resend API Key is connected and sending emails successfully!</p>'
    });

    if (error) {
      console.log('❌ Resend email send error:', error);
      return { success: false, error };
    }

    console.log('🎉 Resend Email Send: SUCCESSFUL!');
    console.log('   Email Dispatch ID:', data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.log('❌ Exception sending email:', err.message);
    return { success: false, error: err.message };
  }
}

testEmailSend();
