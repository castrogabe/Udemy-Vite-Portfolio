import mongoose from 'mongoose';

const portfolioContentSchema = new mongoose.Schema(
  {
    paragraphs: [{ type: String }],

    link: { type: String, default: '' },
    linkText: { type: String, default: '' },
  },
  { timestamps: true }
);

const PortfolioContent =
  mongoose.models?.PortfolioContent ||
  mongoose.model('PortfolioContent', portfolioContentSchema);

export default PortfolioContent;

// If you want to review the commented teaching version of the portfolioContentModel.js setup, check commit lesson-14.
