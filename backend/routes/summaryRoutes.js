// backend/routes/summaryRoutes.js
// -------------------------------------------------------------
// This route provides summary statistics for the admin dashboard.
// It uses MongoDB aggregation pipelines to count users and
// summarize websites by their primary language or tech stack.
// -------------------------------------------------------------

import express from 'express';
import User from '../models/userModel.js';
import Website from '../models/websiteModel.js';
import { isAuth, isAdmin } from '../utils.js'; // Middleware: verify JWT + admin access

// Create a new Express Router
const summaryRouter = express.Router();

// -------------------------------------------------------------
// ROUTE: GET /api/summary
// DESCRIPTION:
//   - Returns aggregate statistics for Users and Websites
//   - Protected route (requires both authentication and admin privileges)
// -------------------------------------------------------------
summaryRouter.get('/summary', isAuth, isAdmin, async (req, res) => {
  try {
    // -------------------------------------------------------------
    // 1️⃣ Aggregate total number of users
    // -------------------------------------------------------------
    // $group stage groups all documents (using _id: null)
    // and computes the sum of users in the collection.
    const users = await User.aggregate([
      { $group: { _id: null, numUsers: { $sum: 1 } } },
    ]);

    // -------------------------------------------------------------
    // 2️⃣ Aggregate number of websites per languageDescription
    // -------------------------------------------------------------
    // Groups all websites by their "languageDescription" field
    // and counts how many websites fall under each category.
    const websites = await Website.aggregate([
      {
        $group: {
          _id: '$languageDescription', // Group by the field
          totalWebsites: { $sum: 1 }, // Count per group
        },
      },
    ]);

    // -------------------------------------------------------------
    // 3️⃣ Send summarized data to the frontend
    // -------------------------------------------------------------
    res.send({ users, websites });
  } catch (err) {
    // Handle unexpected server or database errors
    res.status(500).send({ message: err.message });
  }
});

// -------------------------------------------------------------
// Export router to be mounted in server.js as:
// app.use('/api/summary', summaryRouter);
// -------------------------------------------------------------
export default summaryRouter;
