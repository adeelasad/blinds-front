/**
 * Specific Test Scenario:
 * Customer registers on the website -> Automatically creates a Lead in the Admin CRM.
 */

const API_BASE = 'http://localhost:5000/api';
const ADMIN_KEY = 'admin123!';

async function runRegistrationToLeadTest() {
  console.log('================================================================');
  console.log('🧪 TEST: Customer Registration -> Auto-Create CRM Lead Scenario');
  console.log('================================================================\n');

  const randomSuffix = Date.now().toString().slice(-4);
  const testCustomer = {
    first_name: 'Michael',
    last_name: `Chang-${randomSuffix}`,
    email: `michael.chang.${randomSuffix}@testdmv.com`,
    password: 'SecurePassword123!',
    phone: '301-555-8822',
    address: '4800 Bethesda Ave, Apt 402',
    city: 'Bethesda',
    state: 'MD',
    zip: '20814'
  };

  console.log('1. Simulating customer registration on https://www.luminablinds.com/register...');
  console.log(`   Customer: ${testCustomer.first_name} ${testCustomer.last_name}`);
  console.log(`   Email: ${testCustomer.email}`);
  console.log(`   Location: ${testCustomer.address}, ${testCustomer.city}, ${testCustomer.state} ${testCustomer.zip}`);

  // Step 1: Register Account
  const regResponse = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testCustomer)
  });

  const regData = await regResponse.json();

  if (!regResponse.ok || !regData.success) {
    console.log('❌ Registration failed:', regData.error || 'Unknown error');
    return;
  }

  console.log('✅ Customer account created successfully!');
  console.log(`   Customer ID: ${regData.customer?.id}`);
  console.log(`   JWT Auth Token Issued: ${regData.token ? 'YES' : 'NO'}`);

  // Step 2: Fetch Admin Leads CRM to verify Lead was created
  console.log('\n2. Querying Admin Leads CRM (/api/admin/leads)...');
  const leadsResponse = await fetch(`${API_BASE}/admin/leads`, {
    headers: { 'x-admin-key': ADMIN_KEY }
  });

  const leadsData = await leadsResponse.json();

  if (!leadsResponse.ok || !leadsData.success) {
    console.log('❌ Failed to fetch admin leads:', leadsData.error || 'Unknown error');
    return;
  }

  const matchingLead = leadsData.leads?.find(l => l.email.toLowerCase() === testCustomer.email.toLowerCase());

  if (matchingLead) {
    console.log('🎉 SUCCESS! Customer automatically shows up in the Leads CRM:');
    console.log(`   - Lead ID:        ${matchingLead.id}`);
    console.log(`   - Name:           ${matchingLead.name}`);
    console.log(`   - Email:          ${matchingLead.email}`);
    console.log(`   - Phone:          ${matchingLead.phone}`);
    console.log(`   - City / ZIP:     ${matchingLead.city}, MD ${matchingLead.zip}`);
    console.log(`   - Lead Status:    [${matchingLead.status.toUpperCase()}]`);
    console.log(`   - Lead Source:    [${matchingLead.source}]`);
    console.log(`   - Customer Link:  ${matchingLead.customer_id}`);
    console.log(`   - Notes:          "${matchingLead.notes}"`);
    console.log(`   - Created At:     ${matchingLead.created_at}`);
  } else {
    console.log('❌ Lead was not found in the Admin CRM.');
  }

  console.log('\n================================================================');
  console.log('📊 SCENARIO RESULT: ' + (matchingLead ? 'PASSED ✅' : 'FAILED ❌'));
  console.log('================================================================\n');
}

runRegistrationToLeadTest();
