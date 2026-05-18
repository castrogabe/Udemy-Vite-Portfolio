import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import PortfolioContent from '../models/portfolioContentModel.js';
import { isAuth, isAdmin } from '../utils.js';

const portfolioContentRouter = express.Router();

/**
 * GET /api/portfoliocontent
 * ------------------------------------------
 * Lesson 14:
 * The Portfolio page uses ONE document.
 * This route fetches that document. If it
 * doesn't exist yet, we return an empty structure
 * so the frontend can still render without errors.
 */

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

/**
 * PUT /api/portfoliocontent
 * ------------------------------------------
 * Admin-only route for updating Portfolio
 * content from the CMS page.
 *
 * Uses:
 *  - findOneAndUpdate({}, ...) → update the single doc
 *  - upsert: true → create it if it doesn't exist yet
 *
 * This keeps the portfolio page clean since it only
 * has paragraphs + optional CTA button (no images).
 */

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
