import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function testSupabase() {
  console.log('Testing live Supabase database read & write...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // 1. Test Query Products
    const { data: products, error: prodErr } = await supabase.from('products').select('*').limit(3);
    if (prodErr) {
      console.log('❌ Error querying products table:', prodErr.message);
      return;
    }
    console.log(`✅ Supabase Read Test: Found ${products?.length || 0} existing products in "products" table.`);

    // 2. Test Inserting a Lead
    const testLead = {
      name: 'Live Credential Test Lead',
      phone: '301-555-0199',
      email: 'credential-test@luminablinds.com',
      address: '101 Lakeforest Blvd',
      city: 'Gaithersburg',
      zip: '20877',
      source: 'live_test',
      status: 'new',
      notes: 'Testing live Supabase connection from Antigravity'
    };

    const { data: leadData, error: leadErr } = await supabase
      .from('leads')
      .insert([testLead])
      .select();

    if (leadErr) {
      console.log('❌ Error writing to "leads" table:', leadErr.message);
      console.log('   (If RLS is enabled on Supabase, ensure INSERT policy is allowed for anon/publishable key)');
      return;
    }

    console.log('🎉 Supabase Write Test: SUCCESSFUL!');
    console.log('   Inserted Lead ID:', leadData?.[0]?.id);

    // 3. Clean up test record
    if (leadData?.[0]?.id) {
      await supabase.from('leads').delete().eq('id', leadData[0].id);
      console.log('🧹 Cleaned up test lead from database.');
    }
  } catch (err) {
    console.log('❌ Supabase test exception:', err.message);
  }
}

testSupabase();
