import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import AboutContent from '../models/aboutContentModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isAuth, isAdmin } from '../utils.js';

const aboutContentRouter = express.Router();

// Resolve __dirname (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction
  ? '/var/data/uploads'
  : path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.chmodSync(uploadDir, 0o777); // allow server to write images
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// GET /api/aboutcontent - Fetch about content
aboutContentRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await AboutContent.findOne({});
    if (!content) {
      return res.json({ sections: [], jumbotronImage: null });
    }
    res.json(content);
  })
);

// --- New Routes for Section Images ---
// PUT /api/aboutcontent/image - Upload an image for a section
aboutContentRouter.put(
  '/image',
  isAuth,
  isAdmin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      image: { url: imageUrl, name: req.file.filename },
    });
  })
);

// DELETE /api/aboutcontent/jumbotron - Remove jumbotron image
aboutContentRouter.delete(
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
    } else {
    }

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

// PUT /api/aboutcontent - Replace sections
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

// PUT /api/aboutcontent/section/:sectionIndex - Update specific section
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

// PUT /api/aboutcontent/section/:sectionIndex - Update specific section
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

// If you want to review the commented teaching version of the aboutContentRoutes.js setup, check commit lesson-12.
