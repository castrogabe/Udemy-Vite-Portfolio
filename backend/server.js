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
import websiteRouter from './routes/websiteRoutes.js'; // lesson 6 <= updated lesson 9
import uploadRouter from './routes/uploadRoutes.js'; // lesson 6
import homeContentRouter from './routes/homeContentRoutes.js'; // lesson 11
import fs from 'node:fs'; // lesson 10
import aboutContentRouter from './routes/aboutContentRoutes.js'; // lesson 12
import designContentRouter from './routes/designContentRoutes.js'; // lesson 13

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

// uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// routes
app.use('/api/users', userRouter); // lesson 5
app.use('/api/messages', messageRouter); // lesson 5
app.use('/api/seed', seedRouter); // lesson 6
app.use('/api/summary', summaryRouter); // lesson 6
app.use('/api/websites', websiteRouter); // lesson 9 <= updated from website
app.use('/api/upload', uploadRouter); // lesson 6 / lesson 12: upload single and delete image
app.use('/api/homecontent', homeContentRouter); // lesson 11: added new route group for editing home page sections
app.use('/api/aboutcontent', aboutContentRouter); // lesson 12: added new route group for editing about page sections
app.use('/api/designcontent', designContentRouter); // lesson 13: added new route group for editing design page sections

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
// lesson-09 updated from website
// lesson-10 /uploads
// lesson-11 added homeContentRoutes and moved website search/pagination endpoints from server.js into websiteRoutes.js
// lesson-12 added aboutContentRoutes add single image and delete
// lesson-13 added designContentRoutes
