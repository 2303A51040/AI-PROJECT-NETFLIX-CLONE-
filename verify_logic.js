const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testScenario1() {
  console.log('--- Testing Scenario 1: Unregistered Email ---');
  try {
    const res = await axios.post(`${BASE_URL}/auth/send-otp`, { email: 'nonexistent@example.com' });
    console.log('FAILED: Expected 404, got', res.status);
  } catch (err) {
    if (err.response?.status === 404) {
      console.log('PASSED: Correctly returned 404', err.response.data);
    } else {
      console.log('FAILED: Got', err.response?.status, err.response?.data || err.message);
    }
  }
}

async function testScenario2() {
  console.log('\n--- Testing Scenario 2: Register & Subscription Check ---');
  const testEmail = `test_${Date.now()}@example.com`;
  const testPass = 'test1234';

  try {
    // Register
    console.log('Registering user...');
    await axios.post(`${BASE_URL}/auth/register`, {
      username: `user_${Date.now()}`,
      email: testEmail,
      password: testPass
    });

    // Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPass
    });
    console.log('Login success. User has plan:', loginRes.data.subscription?.plan);

    if (loginRes.data.subscription?.plan === 'None') {
      console.log('PASSED: New user has "None" plan.');
    } else {
      console.log('FAILED: New user plan is', loginRes.data.subscription?.plan);
    }
  } catch (err) {
    console.log('FAILED in Scenario 2:', err.response?.data || err.message);
  }
}

async function runTests() {
  await testScenario1();
  await testScenario2();
}

runTests();
