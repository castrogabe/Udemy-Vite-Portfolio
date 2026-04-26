// backend/routes/seedRoutes.js (ESM)
import express from 'express';
import User from '../models/userModel.js';
import Website from '../models/websiteModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  try {
    await User.deleteMany({});
    await Website.deleteMany({});

    const createdUsers = await User.insertMany(data.users);
    const createdWebsites = await Website.insertMany(data.websites);

    res.send({ createdUsers, createdWebsites });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default seedRouter;

// If you want to review the commented teaching version of the seed routes setup, check commit lesson-06.
