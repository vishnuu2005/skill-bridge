const http = require('http');

const data = JSON.stringify({
  email: 'admin@village.com',
  password: 'Admin@123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🔐 Testing admin login...\n');
console.log('URL: http://localhost:5000/api/users/login');
console.log('Email: admin@village.com');
console.log('Password: Admin@123\n');

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    
    if (res.statusCode === 200) {
      console.log('✅ LOGIN SUCCESSFUL!\n');
      const response = JSON.parse(responseData);
      console.log('User:', response.name);
      console.log('Email:', response.email);
      console.log('isAdmin:', response.isAdmin ? 'Yes ✅' : 'No ❌');
      console.log('Token:', response.token ? 'Present ✅' : 'Missing ❌');
    } else {
      console.log('❌ LOGIN FAILED!\n');
      console.log('Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ CONNECTION ERROR!\n');
  console.log('Error:', error.message);
  console.log('\nIs the backend server running?');
  console.log('To start it:');
  console.log('   cd e:\\village-skill-portal');
  console.log('   npm start');
});

req.write(data);
req.end();
