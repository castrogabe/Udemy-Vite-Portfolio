import mongoose from 'mongoose';

const homeSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String },
  linkText: { type: String },
});

const homeContentSchema = new mongoose.Schema({
  jumbotronText: { type: [String], required: true },
  sections: { type: [homeSectionSchema], required: true },
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

export default HomeContent;

// If you want to review the commented teaching version of the homeContentModel.js setup, check commit lesson-11.
