// backend/server.js
// -------------------------------------------------------------
// This is the main entry point for our Express backend.
// It connects to MongoDB, initializes middleware, and mounts
// all API routes for the Portfolio project.
// -------------------------------------------------------------

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// Import route files
import seedRouter from './routes/seedRoutes.js'; // lesson 6
import userRouter from './routes/userRoutes.js'; // lesson 5
import messageRouter from './routes/messageRoutes.js'; // lesson 5
import summaryRouter from './routes/summaryRoutes.js'; // lesson 6
import websiteRouter from './routes/websiteRoutes.js'; // lesson 6
import uploadRouter from './routes/uploadRoutes.js'; // lesson 6

dotenv.config(); // Load environment variables from .env

// -------------------------------------------------------------
// 1️ Setup __dirname Equivalent for ESM
// -------------------------------------------------------------
// In ES Modules, __dirname is not available by default.
// We recreate it using fileURLToPath + path.dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------------------
// 2️ Connect to MongoDB
// -------------------------------------------------------------
// The connection string is stored in .env (MONGODB_URI)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));
const app = express();

app.use(cors()); // Enable cross-origin requests (frontend ↔ backend)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// -------------------------------------------------------------
// 4️ Mount All Route Modules
// -------------------------------------------------------------
app.use('/api/users', userRouter); // lesson 5
app.use('/api/messages', messageRouter); // lesson 5
app.use('/api/seed', seedRouter); // lesson 6
app.use('/api/summary', summaryRouter); // lesson 6
app.use('/api/website', websiteRouter); // lesson 6
app.use('/api/upload', uploadRouter); // lesson 6

// -------------------------------------------------------------
// 5️ (Optional) Legacy Endpoints for Quick Testing
// -------------------------------------------------------------
// These can be removed later since /api/website/search now
// handles pagination and listing through websiteRoutes.js.
// -------------------------------------------------------------
app.get('/api/websites', async (_req, res) => {
  try {
    const websites = await Website.find();
    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching websites' });
  }
});

app.get('/api/websites/search', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.max(parseInt(req.query.pageSize || '10', 10), 1);

    const filter = {}; // Add keyword or category filters later
    const countWebsites = await Website.countDocuments(filter);
    const pages = Math.max(Math.ceil(countWebsites / pageSize), 1);
    const skip = (page - 1) * pageSize;

    const websites = await Website.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({ websites, page, pages, countWebsites });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching websites' });
  }
});

// -------------------------------------------------------------
// 6 Serve Frontend Build in Production
// -------------------------------------------------------------
// In development, the Vite dev server handles the frontend.
// In production, Express serves the built files from dist.
// -------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// -------------------------------------------------------------
// 7 Start Server
// -------------------------------------------------------------
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

// If you want to review the commented teaching version of the server.js setup, check commit lesson-05.
// lesson-05 added userRouter, messageRouter
// lesson-06 added seedRouter, summaryRouter, websiteRouter, uploadRouter
