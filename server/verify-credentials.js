import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

console.log('====================================================');
console.log('🔍 VERIFYING LIVE CREDENTIALS (SUPABASE & RESEND)');
console.log('====================================================\n');

async function checkSupabase() {
  console.log('1. Checking Supabase Connection...');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Key prefix: ${SUPABASE_KEY ? SUPABASE_KEY.slice(0, 15) + '...' : 'MISSING'}`);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('❌ Supabase credentials missing in server/.env\n');
    return { connected: false, error: 'Missing credentials' };
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Test a basic query to check connectivity and schema
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.log('⚠️  Connected to Supabase successfully, but database tables are not created yet.');
        console.log('   (Postgres error: relation "products" does not exist yet)');
        return { connected: true, tablesNeedCreation: true };
      } else {
        console.log(`❌ Supabase error: [${error.code || 'ERR'}] ${error.message}`);
        return { connected: false, error: error.message };
      }
    }

    console.log(`✅ Supabase Connection: SUCCESSFUL! (Tables exist and accessible)`);
    return { connected: true, tablesExist: true };
  } catch (err) {
    console.log(`❌ Supabase exception: ${err.message}`);
    return { connected: false, error: err.message };
  }
}

async function checkResend() {
  console.log('\n2. Checking Resend Email Service...');
  console.log(`   API Key prefix: ${RESEND_API_KEY ? RESEND_API_KEY.slice(0, 10) + '...' : 'MISSING'}`);

  if (!RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY missing in server/.env\n');
    return { valid: false, error: 'Missing key' };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    // Fetch API domains / API keys or send a test email to onboarding address
    const domains = await resend.domains.list();

    if (domains.error) {
      console.log(`❌ Resend authentication failed: ${domains.error.message}`);
      return { valid: false, error: domains.error.message };
    }

    console.log('✅ Resend API Key: VALID & AUTHENTICATED!');
    if (domains.data?.data) {
      console.log(`   Registered domains on account: ${domains.data.data.length}`);
      domains.data.data.forEach(d => {
        console.log(`   - ${d.name} (status: ${d.status})`);
      });
    }

    return { valid: true, domains: domains.data?.data };
  } catch (err) {
    console.log(`❌ Resend exception: ${err.message}`);
    return { valid: false, error: err.message };
  }
}

async function run() {
  const supabaseResult = await checkSupabase();
  const resendResult = await checkResend();

  console.log('\n====================================================');
  console.log('📊 VERIFICATION SUMMARY');
  console.log('====================================================');
  console.log(`Supabase: ${supabaseResult.connected ? '✅ Connected' : '❌ Failed'}`);
  if (supabaseResult.tablesNeedCreation) {
    console.log(`          ℹ️ Action required: Run SQL schema in Supabase Dashboard`);
  }
  console.log(`Resend:   ${resendResult.valid ? '✅ Authenticated & Active' : '❌ Failed'}`);
  console.log('====================================================\n');
}

run();
