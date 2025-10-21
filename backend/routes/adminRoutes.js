const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard statistics
router.get('/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.delete('/users/:userId/skills/:skillId', adminController.deleteUserSkill);
router.delete('/users/:userId/saved-jobs/:jobId', adminController.deleteUserSavedJob);
router.post('/users/purge/:id', adminController.purgeUserData);
router.post('/users/bulk-delete', adminController.bulkDeleteUsers);

// Job management
router.get('/jobs', adminController.getAllJobs);
router.delete('/jobs/:id', adminController.deleteJob);
router.post('/jobs/bulk-delete', adminController.bulkDeleteJobs);

// Chat management
router.get('/chats', adminController.getAllChats);
router.delete('/chats/:id', adminController.deleteChat);

module.exports = router;
