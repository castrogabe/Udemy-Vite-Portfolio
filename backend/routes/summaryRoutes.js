// backend/routes/summaryRoutes.js (ESM)
import express from 'express';
import User from '../models/userModel.js';
import Website from '../models/websiteModel.js';
import { isAuth, isAdmin } from '../utils.js';

const summaryRouter = express.Router();

summaryRouter.get('/summary', isAuth, isAdmin, async (req, res) => {
  try {
    const users = await User.aggregate([
      { $group: { _id: null, numUsers: { $sum: 1 } } },
    ]);

    const websites = await Website.aggregate([
      { $group: { _id: '$languageDescription', totalWebsites: { $sum: 1 } } },
    ]);

    res.send({ users, websites });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default summaryRouter;

// If you want to review the commented teaching version of the seed summaryRoutes.js setup, check commit lesson-06.
