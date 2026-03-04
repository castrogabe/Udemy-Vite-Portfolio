// routes/aboutContentRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import AboutContent from '../models/aboutContentModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isAuth, isAdmin } from '../utils.js';

const aboutContentRouter = express.Router();

// -----------------------------------------------------------------------------
// LESSON 12 — BACKEND SETUP FOR DYNAMIC ABOUT PAGE
// This route file powers a fully editable About page by supporting:
//   • A single AboutContent document stored in MongoDB
//   • Section-level images (multiple images per section)
//   • Optional jumbotron image (top hero image)
//   • Safe file upload + file deletion on disk
//
// Why this matters:
// - Mongo stores the page structure and text
// - The server stores image files on disk (/uploads or /var/data/uploads on Render)
// - The frontend receives { url, name } so it can display images and delete them later
// -----------------------------------------------------------------------------

// Resolve __dirname (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Choose upload directory depending on environment
// (Render uses /var/data/uploads for Persistent Disk)
const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction
  ? '/var/data/uploads'
  : path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.chmodSync(uploadDir, 0o777); // allow server to write images
}

// -------------------------
// Multer storage engine
// -------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Unique file naming prevents collisions
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// -----------------------------------------------------------------------------
// GET /api/aboutcontent
// Returns the About page content document.
// If it doesn't exist yet, returns a safe default shape.
// -----------------------------------------------------------------------------
aboutContentRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await AboutContent.findOne({});

    // If nothing exists yet, return a safe default shape
    // This prevents frontend crashes (sections.map on undefined, etc.)
    if (!content) {
      return res.json({ sections: [], jumbotronImage: null });
    }

    res.json(content);
  })
);

// -----------------------------------------------------------------------------
// PUT /api/aboutcontent/image
// Uploads an image for a *specific section*.
// This is used in the AboutContentEdit screen.
// -----------------------------------------------------------------------------
aboutContentRouter.put(
  '/image',
  isAuth,
  isAdmin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Image is stored in /uploads, frontend receives { url, name }
    // IMPORTANT: /uploads must be served statically in server.js:
    // app.use('/uploads', express.static(uploadDir))
    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      image: { url: imageUrl, name: req.file.filename },
    });
  })
);

// -----------------------------------------------------------------------------
// DELETE /api/aboutcontent/image
// Removes a specific section image from disk.
// Optional improvement: also remove references in MongoDB sections.
// -----------------------------------------------------------------------------
aboutContentRouter.delete(
  '/image',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { imageName } = req.body;

    if (!imageName) {
      return res.status(400).json({ message: 'Image name is required' });
    }

    // 1) Delete the physical file from disk
    const imagePath = path.join(uploadDir, imageName);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      // If the file doesn't exist, we still might want to clean Mongo references
      // but we'll keep the response consistent.
      // (You can choose to return 404 here if you prefer strict behavior.)
    }

    // 2) Optional: Clean up image references in MongoDB (prevents "ghost images")
    const content = await AboutContent.findOne({});
    if (content?.sections?.length) {
      content.sections = content.sections.map((section) => ({
        ...section.toObject(),
        images: Array.isArray(section.images)
          ? section.images.filter((img) => img.name !== imageName)
          : [],
      }));
      await content.save();
    }

    res.json({ message: 'Image deleted successfully' });
  })
);

// -----------------------------------------------------------------------------
// PUT /api/aboutcontent/jumbotron
// Uploads or replaces the *top hero image* of the About page.
// Supports auto-deleting the old jumbotron image.
// -----------------------------------------------------------------------------
aboutContentRouter.put(
  '/jumbotron',
  isAuth,
  isAdmin,
  upload.single('jumbotronImage'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    let content = await AboutContent.findOne({});

    if (!content) {
      // If no About document exists, create a new one
      content = new AboutContent({
        sections: [],
        // Store the SAVED filename so deletion works later
        jumbotronImage: { url: imageUrl, name: req.file.filename },
      });
    } else {
      // Remove old jumbotron image from disk (prevents orphaned files)
      if (content.jumbotronImage?.name) {
        const oldPath = path.join(uploadDir, content.jumbotronImage.name);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      content.jumbotronImage = { url: imageUrl, name: req.file.filename };
    }

    await content.save();
    res.json({ jumbotronImage: content.jumbotronImage });
  })
);

// -----------------------------------------------------------------------------
// DELETE /api/aboutcontent/jumbotron
// Removes the hero image from both MongoDB and the filesystem.
// -----------------------------------------------------------------------------
aboutContentRouter.delete(
  '/jumbotron',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const content = await AboutContent.findOne({});

    if (!content) {
      return res.status(404).json({ message: 'About content not found' });
    }

    // Remove image file
    if (content.jumbotronImage?.name) {
      const imagePath = path.join(uploadDir, content.jumbotronImage.name);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // Remove reference in MongoDB
    content.jumbotronImage = null;
    await content.save();

    res.json({ message: 'Jumbotron image deleted successfully' });
  })
);

// -----------------------------------------------------------------------------
// PUT /api/aboutcontent
// Replaces the entire list of About sections.
// -----------------------------------------------------------------------------
aboutContentRouter.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sections } = req.body;

    const content = await AboutContent.findOneAndUpdate(
      {},
      { sections },
      { new: true, upsert: true }
    );

    res.json(content);
  })
);

// -----------------------------------------------------------------------------
// PUT /api/aboutcontent/section/:sectionIndex
// Allows updating *only one* section instead of replacing all sections.
// -----------------------------------------------------------------------------
aboutContentRouter.put(
  '/section/:sectionIndex',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sectionIndex } = req.params;
    const updatedSection = req.body.section;

    const content = await AboutContent.findOne({});
    const index = parseInt(sectionIndex, 10);

    if (
      content &&
      Array.isArray(content.sections) &&
      index >= 0 &&
      index < content.sections.length
    ) {
      // Ensure images array always exists
      if (!updatedSection.images) {
        updatedSection.images = [];
      }

      content.sections[index] = updatedSection;
      await content.save();

      res.json({ message: 'Section updated successfully' });
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  })
);

export default aboutContentRouter;
