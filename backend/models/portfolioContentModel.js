// backend/models/portfolioContentModel.js
import mongoose from 'mongoose';

/**
 * Lesson 14 — Portfolio Page CMS Model
 *
 * The Portfolio page contains:
 * 1) A dynamic list of paragraphs
 * 2) An optional Call-to-Action button
 */

const portfolioContentSchema = new mongoose.Schema(
  {
    // Flexible list of intro paragraphs
    paragraphs: [{ type: String }],

    // Optional CTA button
    link: { type: String, default: '' },
    linkText: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent model overwrite during dev hot-reload
const PortfolioContent =
  mongoose.models?.PortfolioContent ||
  mongoose.model('PortfolioContent', portfolioContentSchema);

export default PortfolioContent;
