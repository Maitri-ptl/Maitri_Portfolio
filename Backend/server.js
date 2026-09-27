require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedIfEmpty = require('./config/seedIfEmpty');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Connect to MongoDB, then add the default projects if the collection is empty.
connectDB().then(seedIfEmpty);

const app = express();

// CORS: the frontend (Vite dev server) runs on a different origin/port
// than this API, so browsers block requests unless we explicitly allow
// that origin here.
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Parses incoming JSON request bodies into req.body.
app.use(express.json());

// Mount API routes.
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// Simple health check — useful for confirming the server is up.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler for unmatched routes, then the centralized error handler.
// Order matters: these must be mounted after all real routes.
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
