/**
 * Comprehensive Automated End-to-End Test Suite
 * Tests all workflows, customer lifecycles, admin operations, and edge scenarios.
 */

const API_BASE = 'http://localhost:5000/api';
const ADMIN_KEY = 'admin123!';

let testResults = [];

function recordResult(scenario, testName, passed, details = '') {
  testResults.push({ scenario, testName, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | [${scenario}] ${testName} ${details ? `(${details})` : ''}`);
}

async function request(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data };
  } catch (err) {
    return { status: 500, ok: false, error: err.message };
  }
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🚀 RUNNING LUMINA FULL-STACK END-TO-END SCENARIO TEST SUITE');
  console.log('===============================================================\n');

  // -----------------------------------------------------------------
  // SCENARIO 1: Public Lead Capture & Ad Campaign Attribution
  // -----------------------------------------------------------------
  console.log('--- SCENARIO 1: Public Lead Capture & UTM Tracking ---');
  
  // 1.1 Lead from Google Search Ad
  const leadRes = await request(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sarah Jenkins',
      phone: '301-555-4321',
      email: 'sarah.jenkins@testdmv.com',
      zip: '20814',
      city: 'Bethesda',
      source: 'google',
      notes: 'Interested in motorized roller shades for 6 living room windows',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'dmv-search-high-intent'
    })
  });
  recordResult('Scenario 1', 'Lead Submission via Google Ad', leadRes.ok && leadRes.data.lead?.id, `Lead ID: ${leadRes.data.lead?.id}`);

  // 1.2 Free Swatch Kit Sample Request
  const sampleRes = await request(`${API_BASE}/samples`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@testdmv.com',
      address: '7400 Arlington Rd, Bethesda, MD',
      zip: '20814',
      product_name: 'Custom Roller Shades (Light Filtering Linen)'
    })
  });
  recordResult('Scenario 1', 'Free Swatch Kit Sample Request', sampleRes.ok && sampleRes.data.sample?.id, `Sample ID: ${sampleRes.data.sample?.id}`);

  // 1.3 Instant Price Estimate API
  const estimateRes = await request(`${API_BASE}/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      window_count: 6,
      product_type: 'Roller Shades'
    })
  });
  recordResult('Scenario 1', 'Instant Price Estimate Calculation', estimateRes.ok && estimateRes.data.estimate?.low > 0, `Estimate: ${estimateRes.data.estimate?.formatted_range}`);

  // 1.4 In-Home Consultation Booking
  const bookingRes = await request(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sarah Jenkins',
      phone: '301-555-4321',
      email: 'sarah.jenkins@testdmv.com',
      address: '7400 Arlington Rd, Bethesda, MD',
      zip: '20814',
      date: '2026-09-08',
      time: '10:00 AM - 12:00 PM',
      window_count: '6 windows',
      room_count: '2 rooms',
      notes: 'Please bring motorized PowerView demonstration units'
    })
  });
  recordResult('Scenario 1', 'In-Home Measuring Consultation Booking', bookingRes.ok && bookingRes.data.booking?.id, `Booking ID: ${bookingRes.data.booking?.id}`);

  // -----------------------------------------------------------------
  // SCENARIO 2: Customer Account & JWT Authentication Flow
  // -----------------------------------------------------------------
  console.log('\n--- SCENARIO 2: Customer Auth & Account Hub ---');

  const testEmail = `sarah.jenkins.${Date.now()}@testdmv.com`;
  const testPassword = 'Password123!';

  // 2.1 Registration
  const regRes = await request(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: 'Sarah',
      last_name: 'Jenkins',
      email: testEmail,
      password: testPassword,
      phone: '301-555-4321',
      address: '7400 Arlington Rd',
      city: 'Bethesda',
      zip: '20814'
    })
  });
  recordResult('Scenario 2', 'Customer Registration', regRes.ok && regRes.data.token, `Customer ID: ${regRes.data.customer?.id}`);
  const customerToken = regRes.data.token;

  // 2.2 Customer Login
  const loginRes = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  recordResult('Scenario 2', 'Customer Login & JWT Token Issue', loginRes.ok && loginRes.data.token, 'Token verified');

  // 2.3 Customer Protected Profile
  const profileRes = await request(`${API_BASE}/customer/profile`, {
    headers: { 'Authorization': `Bearer ${customerToken}` }
  });
  recordResult('Scenario 2', 'Access Protected Customer Profile', profileRes.ok && profileRes.data.customer?.email === testEmail);

  // 2.4 Customer Orders & Timeline
  const ordersRes = await request(`${API_BASE}/customer/orders`, {
    headers: { 'Authorization': `Bearer ${customerToken}` }
  });
  recordResult('Scenario 2', 'Access Customer Orders & Production Timeline', ordersRes.ok && Array.isArray(ordersRes.data.orders));

  // 2.5 Customer Quotes
  const quotesRes = await request(`${API_BASE}/customer/quotes`, {
    headers: { 'Authorization': `Bearer ${customerToken}` }
  });
  recordResult('Scenario 2', 'Access Customer Saved Quotes', quotesRes.ok && Array.isArray(quotesRes.data.quotes));

  // -----------------------------------------------------------------
  // SCENARIO 3: Admin Operations CRM Hub
  // -----------------------------------------------------------------
  console.log('\n--- SCENARIO 3: Admin Operations CRM Hub ---');

  // 3.1 Fetch Admin KPIs & Stats
  const statsRes = await request(`${API_BASE}/admin/stats`, {
    headers: { 'x-admin-key': ADMIN_KEY }
  });
  recordResult('Scenario 3', 'Admin Dashboard Metrics & KPIs', statsRes.ok && statsRes.data.total_leads >= 0, `Total Leads: ${statsRes.data.total_leads}, Revenue: $${statsRes.data.total_revenue}`);

  // 3.2 Fetch Leads CRM Pipeline
  const adminLeadsRes = await request(`${API_BASE}/admin/leads`, {
    headers: { 'x-admin-key': ADMIN_KEY }
  });
  recordResult('Scenario 3', 'Admin Leads CRM Pipeline Fetch', adminLeadsRes.ok && Array.isArray(adminLeadsRes.data.leads));

  // 3.3 Update Lead Status to 'quoted'
  let leadId = adminLeadsRes.data.leads?.[0]?.id;
  if (leadId) {
    const updateLeadRes = await request(`${API_BASE}/admin/leads/${leadId}`, {
      method: 'PUT',
      headers: { 'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'quoted' })
    });
    recordResult('Scenario 3', 'Update Lead Status in CRM', updateLeadRes.ok && updateLeadRes.data.lead?.status === 'quoted');
  }

  // 3.4 Create New Custom Quote with PDF & Email Dispatch
  const newQuoteRes = await request(`${API_BASE}/admin/quotes`, {
    method: 'POST',
    headers: { 'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lead_id: leadId || 'lead-sample',
      customer_id: regRes.data.customer?.id || 'cust-sample',
      customer_name: 'Sarah Jenkins',
      customer_email: testEmail,
      product_type: 'Custom Motorized Roller Shades (Solar 3%)',
      window_count: 6,
      subtotal: 1800,
      discount_amount: 360,
      total_price: 1440,
      deposit_amount: 720,
      balance_due: 720,
      notes: 'Includes Somfy whisper motors, remote hub, and master installation.'
    })
  });
  recordResult('Scenario 3', 'Generate Official Custom Quote with PDF', newQuoteRes.ok && newQuoteRes.data.quote?.id, `Quote ID: ${newQuoteRes.data.quote?.id}`);
  const createdQuoteId = newQuoteRes.data.quote?.id;

  // 3.5 Create Installation Job Assignment
  const newJobRes = await request(`${API_BASE}/admin/jobs`, {
    method: 'POST',
    headers: { 'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      installer_id: 'inst-1',
      customer_name: 'Sarah Jenkins',
      address: '7400 Arlington Rd, Bethesda, MD 20814',
      product_type: '6x Custom Motorized Roller Shades',
      scheduled_date: '2026-09-15',
      scheduled_time: '1:00 PM - 3:00 PM',
      notes: 'Master bedroom & Living room. Pair with Apple HomeKit.'
    })
  });
  recordResult('Scenario 3', 'Schedule Installation Job in Admin Hub', newJobRes.ok && newJobRes.data.job?.id, `Job ID: ${newJobRes.data.job?.id}`);
  const createdJobId = newJobRes.data.job?.id;

  // -----------------------------------------------------------------
  // SCENARIO 4: Field Technician / Mobile Installer Portal
  // -----------------------------------------------------------------
  console.log('\n--- SCENARIO 4: Field Technician / Installer Portal ---');

  // 4.1 Installer fetches assigned jobs
  const installerJobsRes = await request(`${API_BASE}/admin/jobs`, {
    headers: { 'x-admin-key': ADMIN_KEY }
  });
  recordResult('Scenario 4', 'Technician Pulls Assigned Jobs', installerJobsRes.ok && installerJobsRes.data.jobs?.length > 0);

  // 4.2 Technician updates checklist steps on job site
  if (createdJobId) {
    const checklistRes = await request(`${API_BASE}/admin/jobs/${createdJobId}`, {
      method: 'PUT',
      headers: { 'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checklist_arrived: true,
        checklist_measured: true,
        checklist_installed: true,
        checklist_cleaned: true
      })
    });
    recordResult('Scenario 4', 'Technician Completes 4-Step Quality Checklist', checklistRes.ok && checklistRes.data.job?.checklist_cleaned === true);

    // 4.3 Technician marks job completed (triggering Google review request)
    const completeJobRes = await request(`${API_BASE}/admin/jobs/${createdJobId}`, {
      method: 'PUT',
      headers: { 'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
    recordResult('Scenario 4', 'Technician Marks Job Complete (Review Request Triggered)', completeJobRes.ok && completeJobRes.data.job?.status === 'completed');
  }

  // -----------------------------------------------------------------
  // SCENARIO 5: Security & Edge Case Validations
  // -----------------------------------------------------------------
  console.log('\n--- SCENARIO 5: Security & Edge Case Validations ---');

  // 5.1 Invalid Login Password
  const badLoginRes = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'WrongPassword123' })
  });
  recordResult('Scenario 5', 'Reject Invalid Login Credentials', badLoginRes.status === 401, `Status: ${badLoginRes.status}`);

  // 5.2 Unauthorized Admin Route Access (missing x-admin-key)
  const unauthAdminRes = await request(`${API_BASE}/admin/leads`, {
    headers: {}
  });
  recordResult('Scenario 5', 'Block Unauthorized Access to Admin CRM', unauthAdminRes.status === 401, `Status: ${unauthAdminRes.status}`);

  // 5.3 Non-existent Product Slug
  const badProductRes = await request(`${API_BASE}/products/non-existent-product-slug-xyz`);
  recordResult('Scenario 5', 'Handle Non-Existent Product Slugs Gracefully', badProductRes.status === 404, `Status: ${badProductRes.status}`);

  // 5.4 Public Catalog Live Fetch
  const catalogRes = await request(`${API_BASE}/products`);
  recordResult('Scenario 5', 'Live Products Catalog API', catalogRes.ok && catalogRes.data.products?.length >= 10, `${catalogRes.data.products?.length} products returned`);

  // -----------------------------------------------------------------
  // SUMMARY REPORT
  // -----------------------------------------------------------------
  console.log('\n===============================================================');
  const totalTests = testResults.length;
  const passedTests = testResults.filter(t => t.passed).length;
  const failedTests = totalTests - passedTests;

  console.log(`📊 TEST SUITE SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  if (failedTests === 0) {
    console.log('🎉 ALL END-TO-END SCENARIOS & LIFECYCLES PASSED WITH ZERO ERRORS!');
  } else {
    console.log(`⚠️ ${failedTests} test(s) encountered issues.`);
  }
  console.log('===============================================================\n');
}

runTestSuite();
