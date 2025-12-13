const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');

// GET all diary entries
router.get('/', async (req, res) => {
  const entries = await Diary.find().sort({ createdAt: -1 });
  res.json(entries);
});

// CREATE diary entry
router.post('/', async (req, res) => {
  const entry = new Diary(req.body);
  const saved = await entry.save();
  res.json(saved);
});

// UPDATE diary entry
router.put('/:id', async (req, res) => {
  const updated = await Diary.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE diary entry
router.delete('/:id', async (req, res) => {
  await Diary.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
