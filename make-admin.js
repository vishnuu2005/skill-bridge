// Make user admin in MongoDB
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const MONGODB_URI = 'mongodb+srv://vishnuarikatlaofficial:vishnu123@vishnuscluster.5nn9j1z.mongodb.net/skillbridge?retryWrites=true&w=majority';

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  skills: Array,
  village: String,
  phone: String,
  isActive: Boolean,
  isAdmin: Boolean,
  savedJobs: Array
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function makeAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'admin@skillbridge.com';
    
    console.log(`🔍 Finding user: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found!');
      console.log('Please create the user first.');
      process.exit(1);
    }

    console.log('✅ User found:', user.name);
    console.log('Current admin status:', user.isAdmin);

    // Update to admin
    user.isAdmin = true;
    user.isActive = true;
    await user.save();

    console.log('\n✅ SUCCESS! User is now an admin!\n');
    console.log('📧 Login Email: admin@skillbridge.com');
    console.log('🔑 Password: Admin@123456');
    console.log('\n🎉 You can now login as admin!\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
