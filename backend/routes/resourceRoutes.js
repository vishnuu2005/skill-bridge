const express = require('express');
const router = express.Router();
const { createResource, listResources, getResource, deleteResource } = require('../controllers/resourceController');
const protect = require('../middleware/auth');

router.post('/', createResource);
router.get('/', listResources);
router.get('/:id', getResource);
// Admin-only delete
router.delete('/:id', protect, async (req, res, next) => {
	try {
		if (!req.user || !req.user.isAdmin) {
			return res.status(403).json({ message: 'Forbidden: admin only' });
		}
		return deleteResource(req, res);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
