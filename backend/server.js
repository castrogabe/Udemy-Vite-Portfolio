// backend/server.js  (ES Modules)
// -------------------------------------------------------------
// This file is the main entry point for the backend server.
// It initializes Express, connects to MongoDB, loads routes,
// handles middleware, and serves the Vite frontend in production.
// -------------------------------------------------------------

// Core imports
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// Route imports
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
// NOTE: If you have Website model/routes, import them here as well.

// -------------------------------------------------------------
// Load environment variables from .env file
// Example: MONGODB_URI, PORT, NODE_ENV, EMAIL credentials, etc.
// -------------------------------------------------------------
dotenv.config();

// -------------------------------------------------------------
// __dirname and __filename equivalents for ES Modules
// Node.js doesn’t provide them by default when using ESM syntax.
// -------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------------------
// MongoDB Connection
// Connect to MongoDB using Mongoose with URI from .env
// -------------------------------------------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// -------------------------------------------------------------
// Initialize Express App
// -------------------------------------------------------------
const app = express();

// -------------------------------------------------------------
// Middleware Setup
// -------------------------------------------------------------
// CORS: Allows frontend requests from different origins (e.g., Vite dev server)
app.use(cors());

// Parses incoming JSON payloads
app.use(express.json());

// Parses URL-encoded form submissions
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------
app.use('/api/users', userRouter); // Authentication & user management
app.use('/api/messages', messageRouter); // Contact form submissions

// -------------------------------------------------------------
// Example: Basic Website Listing Endpoint
// You may replace this with a dedicated route file later.
// -------------------------------------------------------------
app.get('/api/websites', async (_req, res) => {
  try {
    const websites = await Website.find();
    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching websites' });
  }
});

// -------------------------------------------------------------
// Example: Paginated Website Search Endpoint
// Matches the frontend call from Portfolio.jsx
// URL: GET /api/websites/search?page=1&pageSize=10
// -------------------------------------------------------------
app.get('/api/websites/search', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.max(parseInt(req.query.pageSize || '10', 10), 1);

    const filter = {}; // add keyword or category filters later

    const countWebsites = await Website.countDocuments(filter);
    const pages = Math.max(Math.ceil(countWebsites / pageSize), 1);
    const skip = (page - 1) * pageSize;

    const websites = await Website.find(filter)
      .sort({ createdAt: -1 }) // show newest first
      .skip(skip)
      .limit(pageSize);

    res.json({ websites, page, pages, countWebsites });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching websites' });
  }
});

// -------------------------------------------------------------
// Static File Serving for Production
// -------------------------------------------------------------
// - During development (Vite), the frontend is served separately.
// - In production, Express serves the built files from /frontend/dist.
// -------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(distPath));

  // Catch-all route: send index.html for any unrecognized path
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// -------------------------------------------------------------
// Start the Server
// -------------------------------------------------------------
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

// lesson-05 added userRouter, messageRouter
