// backend/routes/uploadRoutes.js (ESM)
import express from 'express';
import multer from 'multer';
import path from 'path';
import { isAdmin, isAuth } from '../utils.js';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // ensure your server serves this: app.use('/uploads', express.static('uploads'))
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
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

uploadRouter.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
  const normalized = `/${req.file.path}`.replace(/\\/g, '/');
  res.send(normalized);
});

export default uploadRouter;

// If you want to review the commented teaching version of the seed uploadRoutes.js setup, check commit lesson-06.
