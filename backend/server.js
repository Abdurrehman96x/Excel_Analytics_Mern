const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');

const chartRoutes = require("./routes/chartRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");




dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', require('./routes/upload'));
app.use("/api/charts", chartRoutes);
app.use("/api/analyze", analyzeRoutes);

// Sample route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
