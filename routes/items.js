const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Item = require('../models/Item');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/items/meta — categories and statuses for dropdowns
router.get('/meta', (req, res) => {
  res.json({
    categories: Item.CATEGORIES,
    statuses: Item.STATUSES
  });
});

// GET /api/items/stats — item count per category (must be before /:id)
router.get('/stats', async (req, res) => {
  try {
    const stats = await Item.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.session.userId) } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalQty: { $sum: '$quantity' } } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/items — list with search, filter, sort
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.session.userId };

    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const allowedSort = ['createdAt', 'name', 'category', 'status'];
    const sort = allowedSort.includes(sortField)
      ? { [sortField]: sortOrder }
      : { createdAt: -1 };

    const items = await Item.find(filter).sort(sort);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.session.userId });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, notes, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const item = new Item({
      user: req.session.userId,
      name: name.trim(),
      category: category || 'Other',
      quantity: quantity || 1,
      notes: notes || '',
      status: status || 'Needed'
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/items/:id
router.put('/:id', async (req, res) => {
  try {
    const allowed = ['name', 'category', 'quantity', 'notes', 'status'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    updates.updatedAt = Date.now();

    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
