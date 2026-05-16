import express from 'express';
import asyncHandler from 'express-async-handler';
import HomeContent from '../models/homeContentModel.js';
import { isAuth, isAdmin } from '../utils.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const content = await HomeContent.findOne({});
    if (!content) {
      res.json({ jumbotronText: [], sections: [] });
    } else {
      res.json(content);
    }
  })
);

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

// If you want to review the commented teaching version of the homeContentRoutes.js setup, check commit lesson-11.
