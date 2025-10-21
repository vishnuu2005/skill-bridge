const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/village-skill-portal';
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set in environment. Falling back to local MongoDB at mongodb://127.0.0.1:27017/village-skill-portal');
    }
    const conn = await mongoose.connect(uri, {
      // useNewUrlParser/useUnifiedTopology are defaults in modern mongoose, leaving options empty
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;


