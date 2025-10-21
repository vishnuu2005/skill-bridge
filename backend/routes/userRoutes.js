const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addSkill,
  getAllUsers,
  verifyToken,
  saveJob,
  unsaveJob,
  getSavedJobs
} = require('../controllers/userController');
const { googleLogin } = require('../controllers/googleAuthController');


// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.get('/users', getAllUsers);

// Protected routes
const auth = require('../middleware/auth');
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.post('/skills', auth, addSkill);
router.get('/verify', auth, verifyToken);
router.post('/jobs/:jobId/save', auth, saveJob);
router.delete('/jobs/:jobId/save', auth, unsaveJob);
router.get('/saved-jobs', auth, getSavedJobs);

module.exports = router;


