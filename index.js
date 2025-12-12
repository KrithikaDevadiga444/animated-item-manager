require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static frontend
app.use(express.static(path.join(__dirname, 'public')));

// routes
const itemsRouter = require('./routes/items');
app.use('/api/items', itemsRouter);

// connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
