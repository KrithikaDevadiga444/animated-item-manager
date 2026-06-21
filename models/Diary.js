const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true
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

DiarySchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Diary', DiarySchema);
