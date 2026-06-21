const mongoose = require('mongoose');

const CATEGORIES = ['Groceries', 'Stationery', 'Electronics', 'Household', 'Other'];
const STATUSES = ['Needed', 'Purchased', 'In Use'];

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: CATEGORIES,
    default: 'Other'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: STATUSES,
    default: 'Needed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ItemSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

ItemSchema.statics.CATEGORIES = CATEGORIES;
ItemSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('Item', ItemSchema);
