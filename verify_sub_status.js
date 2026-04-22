const BASE_URL = 'http://localhost:5000/api';

async function run() {
  const email = `sub_test_${Date.now()}@test.com`;
  const password = 'password123';

  console.log(`Step 1: Registering user ${email}...`);
  await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: `sub_${Date.now()}`, email, password })
  });

  console.log('Step 2: Login and check initial subscription status...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  console.log('Initial plan:', loginData.subscription?.plan);
  console.log('Initial status:', loginData.subscription?.status);

  if (loginData.subscription?.status === 'None') {
    console.log('PASSED: New user starts with status "None".');
  } else {
    console.log('FAILED: Unexpected initial status', loginData.subscription?.status);
  }

  // Clean up
  console.log('Logging out...');
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  console.log('\nSUCCESS: Subscription validation check complete!');
}

run().catch(console.error);
