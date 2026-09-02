import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function testSendToUser() {
  console.log('Testing direct email dispatch to asad.adeel@gmail.com via Resend...');
  const resend = new Resend(RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: 'Lumina Window Treatments <onboarding@resend.dev>',
      to: 'asad.adeel@gmail.com',
      subject: '✅ Lumina Window Treatments — Test Verification Email',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #252525;">Lumina Window Treatments</h2>
          <p>Hi Adeel,</p>
          <p>This is a test email sent directly to your inbox via Resend!</p>
          <p>Your customer account and quote portal are active.</p>
        </div>
      `
    });

    console.log('\n--- RESEND API RESPONSE ---');
    console.log(JSON.stringify(result, null, 2));

    if (result.error) {
      console.log('\n❌ Resend Error Code:', result.error.name);
      console.log('❌ Resend Message:', result.error.message);
    } else {
      console.log('\n🎉 SUCCESS! Email dispatched with ID:', result.data?.id);
    }
  } catch (err) {
    console.log('\n❌ Exception:', err.message);
  }
}

testSendToUser();
