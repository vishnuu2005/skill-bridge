// Quick script to create admin user via API
const axios = require('axios');

const API_URL = 'https://skillbridge-backend-wl2d.onrender.com';

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...\n');
    
    // Register admin user
    const response = await axios.post(`${API_URL}/api/users/register`, {
      name: 'Admin User',
      email: 'admin@skillbridge.com',
      password: 'Admin@123456',
      village: 'Admin Village',
      phone: '1234567890'
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('📧 Email: admin@skillbridge.com');
    console.log('🔑 Password: Admin@123456');
    console.log('\n⚠️  Now updating user to admin role...\n');

    // Get user ID
    const userId = response.data._id;
    console.log('User ID:', userId);
    console.log('\n📝 Please manually set this user as admin in MongoDB Atlas:');
    console.log('1. Go to: https://cloud.mongodb.com/');
    console.log('2. Browse Collections → skillbridge → users');
    console.log(`3. Find user with email: admin@skillbridge.com`);
    console.log('4. Edit document and change: "isAdmin": false  →  "isAdmin": true');
    console.log('5. Save changes');
    console.log('\nThen login with:');
    console.log('📧 Email: admin@skillbridge.com');
    console.log('🔑 Password: Admin@123456');

  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('⚠️  User already exists. Trying to login...\n');
      
      try {
        const loginResponse = await axios.post(`${API_URL}/api/users/login`, {
          email: 'admin@skillbridge.com',
          password: 'Admin@123456'
        });
        
        console.log('✅ Login successful!');
        console.log('User details:', loginResponse.data);
        
        if (loginResponse.data.isAdmin) {
          console.log('\n✅ This user is already an admin!');
        } else {
          console.log('\n⚠️  This user is NOT an admin yet.');
          console.log('Please set isAdmin to true in MongoDB Atlas.');
        }
      } catch (loginError) {
        console.error('❌ Login failed:', loginError.response?.data || loginError.message);
      }
    } else {
      console.error('❌ Error creating admin:', error.response?.data || error.message);
    }
  }
}

createAdmin();
