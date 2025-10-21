const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/village_skill_portal')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const User = mongoose.model('User', new mongoose.Schema({}, {strict: false}));
    const user = await User.findOne({email: 'admin@village.com'});
    
    if (!user) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }
    
    console.log('✅ Admin user found:');
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   isAdmin:', user.isAdmin);
    console.log('   Password hash:', user.password.substring(0, 20) + '...');
    console.log('');
    
    // Test password
    const testPassword = 'Admin@123';
    console.log('🔐 Testing password:', testPassword);
    
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (isMatch) {
      console.log('✅ Password is CORRECT!');
      console.log('');
      console.log('Login should work with:');
      console.log('   Email:', user.email);
      console.log('   Password:', testPassword);
    } else {
      console.log('❌ Password does NOT match!');
      console.log('');
      console.log('Let me reset the password...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      user.password = hashedPassword;
      await user.save();
      
      console.log('✅ Password has been reset!');
      console.log('');
      console.log('Now login with:');
      console.log('   Email:', user.email);
      console.log('   Password:', testPassword);
    }
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
