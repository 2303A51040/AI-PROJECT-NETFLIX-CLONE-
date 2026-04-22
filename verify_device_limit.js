const BASE_URL = 'http://localhost:5000/api';

async function run() {
  const email = `limit_test_${Date.now()}@test.com`;
  const password = 'password123';

  console.log(`Step 1: Registering user ${email}...`);
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: `limit_${Date.now()}`, email, password })
  });
  const user = await regRes.json();
  const token = user.accessToken; // Wait, register might not return token. Let's check.

  console.log('Step 2: Subscribing to Mobile plan (limit 1)...');
  // Need to login first to get token if register doesn't provide it
  const loginRes1 = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const loginData1 = await loginRes1.json();
  const authToken = loginData1.accessToken;

  await fetch(`${BASE_URL}/users/subscription`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ plan: 'Mobile' })
  });

  console.log('Step 3: Logging out to clear the active screen from the initial login...');
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  console.log('Step 4: First login (should succeed, activeScreens -> 1)...');
  const res1 = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  console.log('Login 1 status:', res1.status);

  console.log('Step 5: Second login (should fail, limit 1 reached)...');
  const res2 = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const res2Data = await res2.json();
  console.log('Login 2 status:', res2.status);
  console.log('Login 2 message:', res2Data);

  if (res2.status === 403 && res2Data.includes('Device limit reached')) {
    console.log('\nSUCCESS: Device limit enforced correctly!');
  } else {
    console.log('\nFAILED: Device limit check did not work as expected.');
  }
}

run().catch(console.error);
