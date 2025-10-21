const express = require('express');
const router = express.Router();
const { createResource, listResources, getResource } = require('../controllers/resourceController');

router.post('/', createResource);
router.get('/', listResources);
router.get('/:id', getResource);

module.exports = router;
