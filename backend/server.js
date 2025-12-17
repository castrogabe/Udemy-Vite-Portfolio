// server.js (ESM)
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

dotenv.config();

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to db'))
  .catch((err) => console.error('Mongo error:', err.message));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', userRouter); // lesson 5
app.use('/api/messages', messageRouter); // lesson 5
app.use('/api/seed', seedRouter); // lesson 6
app.use('/api/summary', summaryRouter); // lesson 6
app.use('/api/website', websiteRouter); // lesson 6
app.use('/api/upload', uploadRouter); // lesson 6

// Simple list
app.get('/api/websites', async (_req, res) => {
  try {
    const websites = await Website.find();
    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching websites' });
  }
});

// Optional: pagination/search endpoint to match your Vite frontend call
// GET /api/websites/search?page=1&pageSize=10
app.get('/api/websites/search', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.max(parseInt(req.query.pageSize || '10', 10), 1);

    const filter = {}; // add keyword/category filters later
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

/**
 * Static files:
 * - In dev (Vite), DO NOT serve frontend here. Use Vite dev server + proxy.
 * - In prod, serve the built Vite app from ../frontend/dist
 */
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});

// If you want to review the commented teaching version of the server.js setup, check commit lesson-05.
// lesson-05 added userRouter, messageRouter
// lesson-06 added seedRouter, summaryRouter, websiteRouter, uploadRouter
