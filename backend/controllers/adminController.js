const User = require('../models/user');
const Job = require('../models/job');
const Resource = require('../models/resource');
const Chat = require('../models/chat');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const totalResources = await Resource.countDocuments();
    const totalChats = await Chat.countDocuments();
    
    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Get users by village
    const usersByVillage = await User.aggregate([
      {
        $group: {
          _id: '$village',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get top skills
    const topSkills = await User.aggregate([
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        activeJobs,
        totalResources,
        totalChats,
        recentUsers,
        usersByVillage,
        topSkills
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID with details (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('savedJobs');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get jobs posted by user
    const jobsPosted = await Job.find({ postedBy: user._id });
    
    // Get chats involving user
    const chats = await Chat.countDocuments({
      $or: [{ jobPoster: user._id }, { applicant: user._id }]
    });
    
    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        jobsPosted: jobsPosted.length,
        totalChats: chats
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user status (Admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete user's jobs and chats
    await Job.deleteMany({ postedBy: user._id });
    await Chat.deleteMany({
      $or: [{ jobPoster: user._id }, { applicant: user._id }]
    });
    
    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all jobs (Admin only)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email phone village')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete job (Admin only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Also delete related chats
    await Chat.deleteMany({ job: job._id });
    
    res.status(200).json({
      success: true,
      message: 'Job and related chats deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user's specific skill (Admin only)
exports.deleteUserSkill = async (req, res) => {
  try {
    const { userId, skillId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.skills = user.skills.filter(skill => skill._id.toString() !== skillId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      data: user
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user's saved job (Admin only)
exports.deleteUserSavedJob = async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.savedJobs = user.savedJobs.filter(
      savedJob => savedJob.toString() !== jobId
    );
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Saved job removed successfully',
      data: user
    });
  } catch (error) {
    console.error('Error removing saved job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete chat (Admin only)
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all chats (Admin only)
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('jobPoster', 'name email')
      .populate('applicant', 'name email')
      .populate('job', 'title')
      .sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk delete users (Admin only)
exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Please provide user IDs to delete' });
    }
    
    // Delete users
    const result = await User.deleteMany({ _id: { $in: userIds } });
    
    // Delete their jobs and chats
    await Job.deleteMany({ postedBy: { $in: userIds } });
    await Chat.deleteMany({
      $or: [
        { jobPoster: { $in: userIds } },
        { applicant: { $in: userIds } }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} users and their data deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk delete jobs (Admin only)
exports.bulkDeleteJobs = async (req, res) => {
  try {
    const { jobIds } = req.body;
    
    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ message: 'Please provide job IDs to delete' });
    }
    
    // Delete jobs
    const result = await Job.deleteMany({ _id: { $in: jobIds } });
    
    // Delete related chats
    await Chat.deleteMany({ job: { $in: jobIds } });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} jobs and related chats deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update any user data (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, village, isActive, isAdmin } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (village) updateData.village = village;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, select: '-password', runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete all data for a user (complete purge) (Admin only)
exports.purgeUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user's jobs
    const deletedJobs = await Job.deleteMany({ postedBy: userId });
    
    // Delete user's chats
    const deletedChats = await Chat.deleteMany({
      $or: [{ jobPoster: userId }, { applicant: userId }]
    });
    
    // Remove user from saved jobs of other users
    await User.updateMany(
      { savedJobs: userId },
      { $pull: { savedJobs: userId } }
    );
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({
      success: true,
      message: 'User data completely purged',
      deleted: {
        user: 1,
        jobs: deletedJobs.deletedCount,
        chats: deletedChats.deletedCount
      }
    });
  } catch (error) {
    console.error('Error purging user data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
