// backend/routes/seedRoutes.js
// -------------------------------------------------------------
// This route allows you to reset and seed the database with
// predefined sample data for testing or development.
// -------------------------------------------------------------

import express from 'express';
import User from '../models/userModel.js';
import Website from '../models/websiteModel.js';
import data from '../data.js'; // Import mock data file containing users & websites

// Create a new Express Router instance
const seedRouter = express.Router();

// -------------------------------------------------------------
// ROUTE: GET /api/seed
// DESCRIPTION:
//   - Clears the existing Users and Websites collections
//   - Inserts fresh sample data from /data.js
//   - Returns the created documents in JSON format
// -------------------------------------------------------------
seedRouter.get('/', async (req, res) => {
  try {
    // ⚠️ Delete all existing records before seeding
    await User.deleteMany({});
    await Website.deleteMany({});

    // 🧩 Insert seed data from data.js
    const createdUsers = await User.insertMany(data.users);
    const createdWebsites = await Website.insertMany(data.websites);

    // ✅ Send JSON response containing the newly created data
    res.send({ createdUsers, createdWebsites });
  } catch (error) {
    // ❌ Catch any database or insertion errors
    res.status(500).send({ message: error.message });
  }
});

// -------------------------------------------------------------
// Export router to be mounted in server.js as:
// app.use('/api/seed', seedRouter);
// -------------------------------------------------------------
export default seedRouter;
