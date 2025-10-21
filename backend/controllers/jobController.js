const Job = require('../models/job');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Create job
const createJob = async (req, res) => {
  try {
    const { title, description, skills, village, company, contact, salary, phone, positions } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Get authenticated user's information
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create job with poster information
    const job = await Job.create({ 
      title, 
      description, 
      skills, 
      village, 
      company, 
      contact,
      salary,
      phone,
      positions,
      postedBy: userId,
      postedByName: user.name,
      postedByPhone: user.phone
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List jobs (optionally filter by village or skill)
const listJobs = async (req, res) => {
  try {
    const { village, skill } = req.query;
    const filter = { isActive: true };
    if (village) filter.village = village;
    if (skill) filter.skills = { $in: [skill] };
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a job by id
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Match jobs for authenticated user based on skills and village
const matchJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Match by village OR any overlapping skills
    const userSkills = (user.skills || []).map(s => s.name);
    const filter = {
      isActive: true,
      $or: [
        { village: user.village },
        { skills: { $in: userSkills } }
      ]
    };

    const matches = await Job.find(filter).sort({ createdAt: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, listJobs, getJob, matchJobs };

