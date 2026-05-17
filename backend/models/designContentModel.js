// -----------------------------------------------------------------------------
// designContentModel.js — Lesson 13
// -----------------------------------------------------------------------------
// This schema stores ALL dynamic content for the Design page.
// The structure mirrors the About page from Lesson 12 but adds design-specific
// features such as clickable links (Contact, Quote Request, etc.).
//
// Key Lesson 13 additions:
//   • jumbotronImage is OPTIONAL (same as About page)
//   • Each section now supports:
//        - paragraphs[] (dynamic text blocks)
//        - link + linkText (optional button under section)
//        - images[] (gallery for each section)
//
// This lets the Design page be edited fully through the admin panel.
// -----------------------------------------------------------------------------

import mongoose from 'mongoose';

const designContentSchema = new mongoose.Schema({
  // Optional hero / banner image at top of Design page
  jumbotronImage: {
    url: { type: String, required: false }, // Lesson 13: optional, same as About page
    name: { type: String },
  },

  // Dynamic sections (title + paragraphs + images + optional button)
  sections: [
    {
      title: { type: String, required: true },

      // Multiple paragraphs per section
      paragraphs: [{ type: String, required: true }],

      // Lesson 13: Optional button (e.g., "Contact Me", "Request a Quote")
      link: { type: String }, // URL for the button
      linkText: { type: String }, // Button label

      // Image gallery per section
      images: [
        {
          url: { type: String, required: true },
          name: { type: String }, // original filename
        },
      ],
    },
  ],
});

const DesignContent = mongoose.model('DesignContent', designContentSchema);

export default DesignContent;
