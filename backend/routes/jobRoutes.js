const express = require('express');
const router = express.Router();
const { createJob, listJobs, getJob, matchJobs } = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.post('/', auth, createJob); // Protected: only authenticated users can create jobs
router.get('/', listJobs);
router.get('/:id', getJob);
// Protected route for matches
router.get('/matches', auth, matchJobs);

module.exports = router;
