const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Global Middleware
app.use(express.json());
app.use(cors());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'HostelHub Core Server Online' });
});

// Database & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Connected to MongoDB successfully.');
    app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error(' Database connection error:', err);
  });
