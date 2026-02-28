// models/homeContentModel.js
import mongoose from 'mongoose';

// Defines the structure for a single content section
const homeSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String }, // Now optional
  linkText: { type: String }, // Now optional
});

// Defines the overall structure for the Home page content
const homeContentSchema = new mongoose.Schema({
  jumbotronText: { type: [String], required: true },
  sections: { type: [homeSectionSchema], required: true },
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

export default HomeContent;
