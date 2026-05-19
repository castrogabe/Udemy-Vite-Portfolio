import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import PortfolioContent from '../models/portfolioContentModel.js';
import { isAuth, isAdmin } from '../utils.js';

const portfolioContentRouter = express.Router();

portfolioContentRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const content = await PortfolioContent.findOne({});

    if (content) {
      res.send(content);
    } else {
      res.send({ paragraphs: [], link: '', linkText: '' });
    }
  })
);

portfolioContentRouter.put(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { paragraphs = [], link = '', linkText = '' } = req.body;

    const updatedContent = await PortfolioContent.findOneAndUpdate(
      {},
      {
        $set: {
          paragraphs,
          link,
          linkText,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.send({
      message: 'Portfolio content updated successfully',
      content: updatedContent,
    });
  })
);

export default portfolioContentRouter;

// If you want to review the commented teaching version of the portfolioContentRoues.js setup, check commit lesson-14.
