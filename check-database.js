// Check database collections and data
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://vishnuarikatlaofficial:vishnu123@vishnuscluster.5nn9j1z.mongodb.net/skillbridge?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const jobSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const resourceSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const chatSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);
const Resource = mongoose.model('Resource', resourceSchema);
const Chat = mongoose.model('Chat', chatSchema);

async function checkDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 DATABASE STATISTICS:\n');
    console.log('=' .repeat(50));

    const userCount = await User.countDocuments();
    console.log(`👥 Users: ${userCount}`);
    
    const jobCount = await Job.countDocuments();
    console.log(`💼 Jobs: ${jobCount}`);
    
    const resourceCount = await Resource.countDocuments();
    console.log(`📚 Resources: ${resourceCount}`);
    
    const chatCount = await Chat.countDocuments();
    console.log(`💬 Chats: ${chatCount}`);

    console.log('=' .repeat(50));

    if (userCount > 0) {
      console.log('\n👥 USERS IN DATABASE:\n');
      const users = await User.find({}).select('name email isAdmin createdAt').limit(10);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Admin: ${user.isAdmin}`);
      });
    }

    if (jobCount > 0) {
      console.log('\n💼 RECENT JOBS:\n');
      const jobs = await Job.find({}).select('title company location createdAt').limit(5);
      jobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} at ${job.company || 'N/A'} - ${job.location || 'N/A'}`);
      });
    }

    console.log('\n✅ Database check complete!\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
