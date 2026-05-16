// backend/routes/uploadRoutes.js (ESM)
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isAdmin, isAuth } from '../utils.js';

const uploadRouter = express.Router();
// -------------------------------------------------------------
// Lesson-12 Update:
//   Multer now saves files into an absolute /uploads folder,
//   and we ensure that directory exists on the server.
// -------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads');

// Create uploads folder if it does not exist (important for production)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// -------------------------------------------------------------
// Multer Storage — Lesson-12: improved filename + safe folder path
// -------------------------------------------------------------
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Creates clearer, more predictable filenames (Lesson-12 improvement)
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// -------------------------------------------------------------
// File type filter (Lesson-12: added GIF support)
// -------------------------------------------------------------
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error('Images only!'));
}

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// -------------------------------------------------------------
// POST /api/upload/single
// Lesson-12: standardized JSON response format to match AboutContent + HomeContent editors
// -------------------------------------------------------------
uploadRouter.post(
  '/single',
  isAuth,
  isAdmin,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Lesson-12 format: every uploaded file returns { url, name }
    res.send({
      message: 'Image uploaded successfully',
      image: { url: imageUrl, name: req.file.filename },
    });
  }
);

// -------------------------------------------------------------
// DELETE /api/upload/image
// Lesson-12: new delete endpoint for removing About page images
// -------------------------------------------------------------
uploadRouter.delete('/image', isAuth, isAdmin, (req, res) => {
  const { imageName } = req.body;

  if (!imageName) {
    return res.status(400).send('Image name not provided.');
  }

  const imagePath = path.join(uploadDir, imageName);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    res.send({ message: 'Image deleted successfully' });
  } else {
    res.status(404).send('Image not found.');
  }
});

export default uploadRouter;

// If you want to review the commented teaching version of the seed uploadRoutes.js setup, check commit lesson-06.
// lesson-10 updated return JSON
// lesson-12 updated final version upload single and delete image
