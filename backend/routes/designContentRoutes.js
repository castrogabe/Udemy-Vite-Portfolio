// routes/designContentRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import DesignContent from '../models/designContentModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isAuth, isAdmin } from '../utils.js';

const designContentRouter = express.Router();

// -----------------------------------------------------------------------------
// LESSON 13 — BACKEND SETUP FOR DYNAMIC DESIGN PAGE
// This follows the same pattern as AboutContent (Lesson 12) but adds:
//   • Optional jumbotron image
//   • Section-level images
//   • Section-level buttons (link + linkText)
// -----------------------------------------------------------------------------

// Resolve __dirname (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Choose upload directory depending on environment
// (Render uses /var/data/uploads)
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
// GET /api/designcontent
// Returns the entire dynamic design page content
// (same pattern as AboutContent from Lesson 12)
// -----------------------------------------------------------------------------
designContentRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await DesignContent.findOne({});
    res.json(content);
  })
);

// -----------------------------------------------------------------------------
// PUT /api/designcontent/image
// Uploads an image for a *specific section*.
// This is used in the DesignContentEdit screen.
// -----------------------------------------------------------------------------
designContentRouter.put(
  '/image',
  isAuth,
  isAdmin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Image is stored in /uploads, frontend receives { url, name }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      image: { url: imageUrl, name: req.file.filename },
    });
  })
);

// -----------------------------------------------------------------------------
// DELETE /api/designcontent/image
// Removes a specific section image from disk.
// Mirrors the AboutContent deletion logic.
// -----------------------------------------------------------------------------
designContentRouter.delete(
  '/image',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { imageName } = req.body;
    if (!imageName) {
      return res.status(400).json({ message: 'Image name is required' });
    }

    const imagePath = path.join(uploadDir, imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  })
);

// -----------------------------------------------------------------------------
// PUT /api/designcontent/jumbotron
// Uploads or replaces the *top hero image* of the Design page.
// Supports auto-deleting the old jumbotron image.
// -----------------------------------------------------------------------------
designContentRouter.put(
  '/jumbotron',
  isAuth,
  isAdmin,
  upload.single('jumbotronImage'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    let content = await DesignContent.findOne({});
    if (!content) {
      // If no design document exists, create a new one
      content = new DesignContent({
        sections: [],
        jumbotronImage: { url: imageUrl, name: req.file.originalname },
      });
    } else {
      // Remove old jumbotron image from disk
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
// DELETE /api/designcontent/jumbotron
// Removes the hero image from both MongoDB and the filesystem.
// -----------------------------------------------------------------------------
designContentRouter.delete(
  '/jumbotron',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const content = await DesignContent.findOne({});
    if (!content)
      return res.status(404).json({ message: 'Design content not found' });

    // Remove image file
    if (content.jumbotronImage?.name) {
      const imagePath = path.join(uploadDir, content.jumbotronImage.name);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    content.jumbotronImage = null;
    await content.save();

    res.json({ message: 'Jumbotron image deleted successfully' });
  })
);

// -----------------------------------------------------------------------------
// PUT /api/designcontent
// Replaces the entire list of design sections.
// Same behavior as AboutContent's update route.
// -----------------------------------------------------------------------------
designContentRouter.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sections } = req.body;

    const content = await DesignContent.findOneAndUpdate(
      {},
      { sections },
      { new: true, upsert: true }
    );

    res.json(content);
  })
);

// -----------------------------------------------------------------------------
// PUT /api/designcontent/section/:sectionIndex
// Allows updating *only one* section instead of replacing all sections.
// Used to support more advanced UI editors.
// -----------------------------------------------------------------------------
designContentRouter.put(
  '/section/:sectionIndex',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sectionIndex } = req.params;
    const updatedSection = req.body.section;

    const content = await DesignContent.findOne({});
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

export default designContentRouter;
