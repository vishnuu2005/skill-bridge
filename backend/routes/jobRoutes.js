const express = require('express');
const router = express.Router();
const { createJob, listJobs, getJob, matchJobs, deleteJob } = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.post('/', auth, createJob); // Protected: only authenticated users can create jobs
router.get('/', listJobs);
router.get('/:id', getJob);
// Protected route for matches
router.get('/matches', auth, matchJobs);
// Protected route for deleting jobs
router.delete('/:id', auth, deleteJob);
router.delete('/:id', auth, deleteJob); // Protected: only job poster can delete their jobs

module.exports = router;
