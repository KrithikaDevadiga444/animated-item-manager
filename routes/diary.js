const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/diary — sort by newest (default) or oldest
router.get('/', async (req, res) => {
  try {
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;
    const entries = await Diary.find({ user: req.session.userId }).sort({ createdAt: sortOrder });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/diary
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const entry = new Diary({
      user: req.session.userId,
      content: content.trim()
    });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/diary/:id
router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const updated = await Diary.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { content: content.trim(), updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/diary/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Diary.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
