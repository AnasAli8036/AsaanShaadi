// Simple test script to verify login functionality
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with admin credentials...');
    
    const response = await axios.post('http://localhost:4200/api/auth/login', {
      email: 'admin@asaanshaadi.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Test if the token works
    const token = response.data.data.token;
    console.log('\nTesting token with protected endpoint...');
    
    const protectedResponse = await axios.get('http://localhost:4200/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Protected endpoint successful!');
    console.log('Profile:', JSON.stringify(protectedResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testLogin();
