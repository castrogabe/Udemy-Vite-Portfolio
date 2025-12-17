// backend/models/websiteModel.js
import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    language: { type: String, required: true },
    languageDescription: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev/hot-reload
const Website =
  mongoose.models?.Website || mongoose.model('Website', websiteSchema);

export default Website;

// If you want to review the commented teaching version of the websiteModel.js setup, check commit lesson-06.
