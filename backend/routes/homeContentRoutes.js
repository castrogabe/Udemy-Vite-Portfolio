import express from 'express';
import asyncHandler from 'express-async-handler';
import HomeContent from '../models/homeContentModel.js';
import { isAuth, isAdmin } from '../utils.js';

const router = express.Router();

// GET /api/homecontent - Fetch home content
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await HomeContent.findOne({});
    // Return an empty object with an empty sections array if no content is found
    if (!content) {
      res.json({ jumbotronText: [], sections: [] });
    } else {
      res.json(content);
    }
  })
);

// PUT /api/homecontent - Update home content
router.put(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { jumbotronText, sections } = req.body;
    const content = await HomeContent.findOneAndUpdate(
      {},
      { jumbotronText, sections },
      { new: true, upsert: true }
    );
    res.json(content);
  })
);

export default router;
