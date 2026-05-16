import mongoose from 'mongoose';

/**
 * ---------------------------------------------------------------------------
 * About Content Model — Lesson 12
 * ---------------------------------------------------------------------------
 * This schema powers the dynamic "AboutUs" page.
 *
 * Admins will be able to update:
 *   • A single optional jumbotron image
 *   • A list of content sections
 *       - each with a title
 *       - one or more paragraphs
 *       - optional images per section
 *
 * The structure matches what the frontend About page will render.
 * ---------------------------------------------------------------------------
 */

const aboutContentSchema = new mongoose.Schema({
  // Optional hero image at the top of the About page
  jumbotronImage: {
    url: { type: String, required: false }, // Lesson 12: made optional
    name: { type: String },
  },

  // Repeating content sections for the About page
  sections: [
    {
      title: { type: String, required: true },

      // One section may contain multiple paragraphs
      paragraphs: [{ type: String, required: true }],

      // Optional gallery of images for that section
      images: [
        {
          url: { type: String, required: true },
          name: { type: String },
        },
      ],
    },
  ],
});

// Export the model using the ORIGINAL naming used throughout the finished app
const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

export default AboutContent;
