const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use env variable in production
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || null; // Set via .env in production

let client = null;
if (!GOOGLE_CLIENT_ID) {
  console.warn('WARNING: GOOGLE_CLIENT_ID is not set. Google login will not work until you set this environment variable.');
} else {
  client = new OAuth2Client(GOOGLE_CLIENT_ID);
}

// POST /api/users/google-login
const googleLogin = async (req, res) => {
  if (!client) {
    return res.status(500).json({ message: 'Google login is not configured. Please set GOOGLE_CLIENT_ID environment variable.' });
  }
  const { credential } = req.body;
  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: sub, // Not used, but required by schema
        village: '',
        phone: '',
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      village: user.village,
      phone: user.phone,
      skills: user.skills,
      token,
    });
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

module.exports = { googleLogin };
