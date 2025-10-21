const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔐 Testing admin login...\n');
    console.log('Attempting to login to: http://localhost:5000/api/users/login');
    console.log('Email: admin@village.com');
    console.log('Password: Admin@123\n');
    
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: 'admin@village.com',
      password: 'Admin@123'
    });
    
    console.log('✅ LOGIN SUCCESSFUL!\n');
    console.log('Response data:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\nToken:', response.data.token ? 'Present ✅' : 'Missing ❌');
    console.log('isAdmin:', response.data.isAdmin ? 'Yes ✅' : 'No ❌');
    
  } catch (error) {
    console.log('❌ LOGIN FAILED!\n');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error message:', error.response.data.message);
      console.log('\nFull response:');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('❌ No response from server!');
      console.log('Is the backend server running?');
      console.log('\nTo start backend:');
      console.log('   cd e:\\village-skill-portal');
      console.log('   npm start');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
