// backend/routes/uploadRoutes.js
// -------------------------------------------------------------
// This route handles image uploads to the backend server.
// It uses Multer (a Node.js middleware) to process file uploads
// and stores them in the /uploads directory.
// -------------------------------------------------------------

import express from 'express';
import multer from 'multer'; // For handling multipart/form-data (file uploads)
import path from 'path'; // To handle file extensions and paths
import { isAdmin, isAuth } from '../utils.js'; // Middleware to restrict uploads to admin users

// Create an Express router
const uploadRouter = express.Router();

// -------------------------------------------------------------
// 1️⃣ Configure Multer Storage
// -------------------------------------------------------------
// destination(): where files are stored
// filename(): define how the uploaded file will be named
// -------------------------------------------------------------
const storage = multer.diskStorage({
  // Destination folder where uploaded files will be saved
  destination(req, file, cb) {
    // Ensure that the server serves this directory in server.js:
    // app.use('/uploads', express.static('uploads'))
    cb(null, 'uploads/');
  },

  // Define filename pattern (e.g., image-17064793023.png)
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// -------------------------------------------------------------
// 2️⃣ File Type Validation
// -------------------------------------------------------------
// Restrict uploads to common image formats only
// -------------------------------------------------------------
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error('Images only!')); // Reject non-image uploads
}

// -------------------------------------------------------------
// 3️⃣ Initialize Multer with our storage and validation logic
// -------------------------------------------------------------
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// -------------------------------------------------------------
// 4️⃣ Upload Route
// -------------------------------------------------------------
// ROUTE: POST /api/upload
// DESCRIPTION: Uploads a single image file to the server
// MIDDLEWARES: isAuth + isAdmin = only logged-in admins can upload
// -------------------------------------------------------------
uploadRouter.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
  // Normalize the file path for cross-platform compatibility
  const normalized = `/${req.file.path}`.replace(/\\/g, '/');

  // Respond with the relative path of the uploaded file
  res.send(normalized);
});

// -------------------------------------------------------------
// Export the router to be mounted in server.js as:
// app.use('/api/upload', uploadRouter);
// -------------------------------------------------------------
export default uploadRouter;
