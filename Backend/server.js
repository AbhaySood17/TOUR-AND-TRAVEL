require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());

const corsOrigin = process.env.CLIENT_URL;
if (corsOrigin) {
  app.use(
    cors({ origin: corsOrigin.split(',').map((s) => s.trim()) })
  );
} else {
  app.use(cors());
}

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));


app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/packages', require('./routes/packageRoutes'));


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Try a different port or stop the conflicting process.`);
  } else {
    console.log('Server error:', err); 
  }
});