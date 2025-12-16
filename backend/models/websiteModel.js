// backend/models/websiteModel.js
// -------------------------------------------------------------
// This file defines the Mongoose schema and model for "websites"
// that will appear in the Portfolio page of the frontend.
// -------------------------------------------------------------

import mongoose from 'mongoose';

// -------------------------------------------------------------
// 1️⃣ Define Schema
// -------------------------------------------------------------
// Each website entry in the database will have the following fields:
// - name:           The name of the project or website
// - slug:           A unique identifier used in URLs
// - image:          The main preview image
// - language:       The primary technology/language used
// - languageDescription: A short explanation of how it was built
// - description:    A longer project description
// - link:           The URL to visit the live project
// -------------------------------------------------------------
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
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// -------------------------------------------------------------
// 2️⃣ Create Model
// -------------------------------------------------------------
// mongoose.models?.Website ensures that during hot-reload in dev mode,
// the model isn’t re-declared multiple times.
// -------------------------------------------------------------
const Website =
  mongoose.models?.Website || mongoose.model('Website', websiteSchema);

// -------------------------------------------------------------
// 3️⃣ Export Model
// -------------------------------------------------------------
// This makes the model accessible in routes or controllers,
// for example in routes/websiteRoutes.js
// -------------------------------------------------------------
export default Website;
