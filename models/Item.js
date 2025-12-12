const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'general' },
  quantity: { type: Number, default: 1 },
  bought: { type: Boolean, default: false },
  createdBy: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
