const Resource = require('../models/resource');

const createResource = async (req, res) => {
  try {
    const { title, description, type, skillsCovered, provider, url, village } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const resource = await Resource.create({ title, description, type, skillsCovered, provider, url, village });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listResources = async (req, res) => {
  try {
    const { village, skill } = req.query;
    const filter = { isActive: true };
    if (village) filter.village = village;
    if (skill) filter.skillsCovered = { $in: [skill] };
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const id = req.params.id;
    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    await Resource.findByIdAndDelete(id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createResource, listResources, getResource, deleteResource };
